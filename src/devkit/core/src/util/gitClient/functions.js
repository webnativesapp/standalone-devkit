var os = require('os');
var errors = require('./errors');
var semver = {};

// Can't wait for destructuring assingments...
var UnknownGitRevision = errors.UnknownGitRevision;
var FatalGitError = errors.FatalGitError;
var UnknownGitOption = errors.UnknownGitOption;


// the git commands on windows don't return the OS end of line (\r\n)
// using this regex for all end of line matching instead of os.EOL
// when parsing command responses
var EOL_REGEX = /[\r]?\n/;

/**
 * remove leading / trailing whitespace from a string
 */

function strip(str) {
  return str.replace(/^\s+|\s+$/g, '');
}

/**
 * Filter local tags which are valid semvers and return the highest version
 *
 * @return Promise<string>
 */

exports.getLatestLocalTag = function getLatestLocalTag (cb) {
  var git = this;
  return git('fetch', '--tags').then(function () {
    return git('tag', '-l', {extraSilent: true});
  }).then(function (tags) {
    if (tags) {
      tags = tags.split(EOL_REGEX).filter(semver.valid);
      tags.sort(semver.rcompare);
      return tags[0];
    }

    return void 0;
  }).nodeify(cb);
};

/**
 * Filter local tags which are valid semvers
 *
 * @return Promise<Array<String>>
 */

exports.getLocalTags = function getLocalTags (cb) {
  var git = this;
  return git('tag', '-l', {extraSilent: true}).then(function (tags) {
    if (tags) {
      tags = tags.split(EOL_REGEX).filter(semver.valid);
      tags.sort(semver.rcompare);
      return tags;
    }

    return [];
  }).nodeify(cb);
};

/**
 * Handle errors generated by git show-ref
 *
 * Promise will resolve with false if exitted normally
 *
 * @api private
 * @return Promise<Boolean, Error>
 */

function handleShowRefVerifyError (err) {
  if (err && err.code && err.code === 1) {
    // ref does not exist
    return Promise.resolve(false);
  }
  return Promise.reject(err);
}

/**
 * See if ref is a local branch
 *
 * @returns {Promise<boolean>}
 */

exports.isLocalBranch = function isLocalBranch (ref, cb) {
  return this(
    'show-ref', '--verify', '--quiet', '--heads', 'refs/heads/' + ref
  ).return(true).catch(handleShowRefVerifyError).nodeify(cb);
};

/**
 * See if ref is a remote branch
 */

exports.isRemoteBranch = function isRemoteBranch (ref, cb) {
  return this(
    'show-ref', '--verify', '--quiet', '--heads', 'refs/remotes/origin/' + ref
  ).return(true).catch(handleShowRefVerifyError).nodeify(cb);
};

/**
 * Check if repo has branch either remote or local
 *
 * @return {Promes<boolean>}
 */

exports.isBranch = function isBranch (ref, cb) {
  return Promise.all([
    this.isLocalBranch(ref),
    this.isRemoteBranch(ref)
  ]).spread(function (local, remote) {
    return local || remote;
  }).nodeify(cb);
};

/**
 * See if ref is a local tag
 *
 * @returns {Promise<boolean>}
 */

exports.isTag = function isTag (ref, cb) {
  return this('show-ref', '--verify', '--quiet', '--tags', 'refs/tags/' + ref)
  .return(true).catch(handleShowRefVerifyError).nodeify(cb);
};

/**
 * Check that hash is valid
 *
 * @returns {Promise<boolean>}
 */

exports.isHashValidRef = function isHashValidRef (hash, cb) {
  // Check that hash format is ok before calling into git
  if (!/^[a-f0-9]{40}$/i.test(hash)) {
    return Promise.reject(false);
  }

  return this('log', '--pretty=format:%H', '-n', '1', hash)
  .return(true)
  .catch(function (err) {
    // How did we get here without err being set?
    if (!err) { return Promise.reject(); }

    // Return false if couldn't find ref
    if (err.code === 128 && /bad object/.test(err.stderr)) {
      return false;
    }

    // Unexpected error
    return Promise.reject(err);
  }).nodeify(cb);
};

exports.getRefType = function getRefType (ref, cb) {
  return Promise.all([
    this.isTag(ref),
    this.isBranch(ref),
    this.isHashValidRef(ref)
  ]).spread(function (isTag, isBranch, isHash) {
    // Cannot find ref locally
    if (!isTag && !isBranch && !isHash) {
      return Promise.reject(new Error('invalid ref: ' + ref));
    }

    if (isTag) {
      return 'tag';
    } else if (isBranch) {
      return 'branch';
    } else if (isHash) {
      return 'hash';
    }
  }).nodeify(cb);
};

/**
 * Get hash for current HEAD ref
 *
 * @return {Promise<string>}
 */

exports.getCurrentHead = function getCurrentHead (cb) {
  return this('rev-parse', 'HEAD').then(function (ref) {
    return strip(ref);
  }).nodeify(cb);
};

/**
 * Get current tag name - if any
 *
 * @return {Promise<string>}
 */

exports.getCurrentTag = function getCurrentTag (cb) {
  return this('describe', '--tags', '--exact-match').then(function (tag) {
    return strip(tag);
  }).catch(FatalGitError, function (err) {
    var msg = err.message;
    if (/cannot describe/.test(msg) || /no tag/.test(msg)) {
      return Promise.resolve('');
    }

    return Promise.reject(err);
  }).catch(function (err) {
    if (err.stderr) {
      if (/no tag/.test(err.stderr) || /no names found/i.test(err.stderr)) {
        return;
      }
    }

    return Promise.reject(err);
  }).nodeify(cb);
};

/**
 * Get primary branch name. Looks up origin's HEAD pointer and resolves it a
 * branch name. If there is no origin HEAD ref, fall back to local.
 *
 * @return {Promise<string>}
 */

exports.getPrimaryBranchName = function getPrimaryBranchName (cb) {
  //return this('rev-parse', '--symbolic-full-name', 'HEAD').then(function () {
  return this(
    'rev-parse', '--symbolic-full-name', 'origin/HEAD'
  ).catch(function (err) {
    // Couldn't find a HEAD pointer for origin
    if (err.code === 128 && /unknown revision/.test(err.stderr)) {
      return this('rev-parse', '--symbolic-full-name', 'HEAD');
    }

    // Unexpected error occurred
    return Promise.reject(err);
  }).then(function (ref) {
    // Return just the branch name
    return ref.split('/').pop();
  }).nodeify(cb);
};

/**
 * Get a tag, branch name, or hash for the specified version
 *
 * If version is undefined, get the latest valid semver tag. If no valid semver
 * tags are available, fall back to the primary branch.
 *
 * If version is a tag name, branch, or hash, validate that it exists in the
 * repository and return the tag name.
 *
 * If the version cannot be resolved, reject with UnknownGitRevision.
 *
 * @return {Promise<String, UnknownGitRevision>}
 */

exports.validateVersion = function validateVersion (version, cb) {
  if (!version) {
    return this.ensureVersion().nodeify(cb);
  }

  return Promise.all([
    this.isTag(version),
    this.isBranch(version),
    this.isHashValidRef(version)
  ]).bind(this).spread(function (isTag, isBranch, isValidHash) {
    if (isTag || isBranch || isValidHash) { return version; }
    return Promise.reject(new UnknownGitRevision(version));
  }).nodeify(cb);
};

/**
 * @typedef ShowRefInfo
 * @param {string} ref
 * @param {string} hash
 * @param {string} [remote]
 */

/**
 * Parse output from `git show-ref`
 *
 * @api private
 * @return {Array<ShowRefInfo>}
 */

function parseShowRefOutput (refs) {
  // TODO handle tags
  return (refs || '').split(EOL_REGEX).filter(function (str) {
    return !!str;
  }).map(function (ref) {
    var parts = ref.split(' ');
    var hash = parts[0];
    var refSpec = parts[1].split('/');
    var branch = refSpec[refSpec.length - 1];
    var isRemote = /^refs\/remotes\//.test(parts[1]);
    var remote = isRemote ?
      /^refs\/remotes\/([a-zA-Z0.9_-]+)\//.exec(parts[1]) :
      void 0;

    return {
      ref: branch,
      remote: remote,
      hash: hash
    };
  });
}

/**
 * get hash for a given ref. If ref is a branch name, get the hash for the
 * branch on origin with fallback to local branch head.
 *
 * @return {Promise<String, UnknownGitRevision>}
 */

exports.getHashForRef = function getHashForRef (ref, cb) {
  trace('gitClient#getHashForRef');
  return this('show-ref', ref).bind(this)
  .catch(handleShowRefVerifyError)
  .then(function findMostCurrentRef(refs) {
    trace('refs', refs);
    refs = parseShowRefOutput(refs);

    var remote = refs.filter(function (refInfo) {
      return refInfo.remote && refInfo.ref === ref;
    })[0];

    trace('remote', remote);

    if (remote) { return remote.hash; }

    var local = refs.filter(function (refInfo) {
      return refInfo.ref.trim() === ref;
    })[0];

    trace('local', local);
    if (local) { return local.hash; }

    // See if ref is a valid hash
    return this('rev-parse', ref).then(function isRef(res) {
      return ref;
    }).catch(function () {
      return Promise.reject(new UnknownGitRevision(ref));
    });

  }).nodeify(cb);
};

/**
 * Fetch from origin. Gets tags and refs
 */

exports.fetch = function fetch (cb) {
  return Promise.all([
    this('fetch'),
    this('fetch', '--tags')
  ]).nodeify(cb);
};

/**
 * Given some version, ensure that it is something useful in the context of
 * this repository.
 *
 * Semantics:
 *   version is undefined -> get latest semver or primary branch name
 *   version is a string ->
 *
 * @return {Promise<String, UnknownGitRevision>}
 */

exports.ensureVersion = function ensureVersion (version, cb) {
  if (!version) {
    return this.getLatestLocalTag().bind(this).then(function (tag) {
      if (tag) {
        return tag;
      }

      return this.getPrimaryBranchName();
    }).nodeify(cb);
  }

  return Promise.resolve(version).nodeify(cb);
};

/**
 * Checkout some reference. Delegates to checkoutBranch if ref is a branch, or
 * checkoutTagOrHash otherwise.
 *
 * @param {string} ref
 * @return {Promise}
 */

exports.checkoutRef = function checkoutRef (ref, cb) {
  var git = this;
  return git.isBranch(ref).then(function (isBranch) {
    if (isBranch) {
      // Handle branch request. Branches are special since we will pull after
      // checkout.
      return git.checkoutBranch(ref);
    }

    // Handle other request (tags, hash)
    return git.checkoutTagOrHash(ref);
  }).nodeify(cb);
};

/**
 * Simply checkout a ref directly. The ref is assumed to be available.
 */

exports.checkoutTagOrHash = function checkoutTagOrHash (ref, cb) {
  return this('checkout', ref).nodeify(cb);
};

/**
 * Checkout a branch. Update from the remote if the local is not recent.
 */

exports.checkoutBranch = function checkoutBranch (ref, cb) {
  var branch = ref;
  var git = this;
  return git.isLocalBranch(branch).then(function (local) {
    if (local) {
      return git('checkout', branch);
    }

    return git('checkout', '-b', branch);
  }).catch(function (err) {
    logger.error('Failed to checkout branch', branch);
    return Promise.reject(err);
  }).then(function () {
    return git('reset', '--hard', 'origin/' + branch);
  }).nodeify(cb);
};
