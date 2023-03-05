import device;
import event.Emitter as Emitter;
import util.setProperty as setProperty;

var nativeSendEvent = NATIVE && NATIVE.plugins && bind(NATIVE.plugins, 'sendEvent') || function () {};
var nativeRegisterHandler = NATIVE && NATIVE.events.registerHandler && bind(NATIVE.events, 'registerHandler') || function () {};


var LocalNotify = Class(Emitter, function (supr) {
	var _activeCB = [];
	var _getCB = {};
	var _pending = [];
	var _onNotify;

	var deliverPending = function() {
		if (_onNotify) {
			for (var ii = 0; ii < _pending.length; ++ii) {
				_onNotify(_pending[ii]);
			}
			_pending.length = 0;
		}
	}

	var UnpackInfo = function(info) {
		try {
			info.date = new Date(info.utc * 1000);
			info.userDefined = JSON.parse(info.userDefined);
		} catch (e) {
		}
	}

	this.init = function() {
		supr(this, 'init', arguments);

		nativeRegisterHandler("LocalNotifyList", function(evt) {
			for (var ii = 0; ii < evt.list.length; ++ii) {
				UnpackInfo(evt.list[ii]);
			}

			for (var ii = 0; ii < _activeCB.length; ++ii) {
				_activeCB[ii](evt.list);
			}
			_activeCB.length = 0;
		});

		nativeRegisterHandler("LocalNotifyGet", function(evt) {
			var info = evt.info;

			UnpackInfo(info);

			var cbs = _getCB[info.name];
			if (cbs) {
				for (var ii = 0; ii < cbs.length; ++ii) {
					cbs[ii](evt.error ? null : info);
				}
				cbs.length = 0;
			}
		});

		nativeRegisterHandler("LocalNotify", function(evt) {
			var info = evt.info;

			UnpackInfo(info);

			if (_onNotify) {
				logger.log("{localNotify} Delivering event", info.name);

				_onNotify(info);
			} else {
				logger.log("{localNotify} Pending event", info.name);

				_pending.push(info);
			}
		});

		setProperty(this, "onNotify", {
			set: function(f) {
				// If a callback is being set,
				if (typeof f === "function") {
					_onNotify = f;

					setTimeout(deliverPending, 0);
				} else {
					_onNotify = null;
				}
			},
			get: function() {
				return _onNotify;
			}
		});

		// Tell the plugin we are ready to handle events
		nativeSendEvent("LocalNotifyPlugin", "Ready", "{}");
	};

	this.list = function(next) {
		if (_activeCB.length === 0) {
			nativeSendEvent("LocalNotifyPlugin", "List", "{}");
		}
		_activeCB.push(next);
	}

	this.get = function(name, next) {
		nativeSendEvent("LocalNotifyPlugin", "Get", JSON.stringify({
			name: name
		}));

		if (_getCB[name]) {
			_getCB[name].push(next);
		} else {
			_getCB[name] = [next];
		}
	}

	this.clear = function() {
		nativeSendEvent("LocalNotifyPlugin", "Clear", "{}");
	}

	this.remove = function(name) {
		nativeSendEvent("LocalNotifyPlugin", "Remove", JSON.stringify({
			name: name
		}));
	}

	this.add = function(opts) {
		// Inject date
		var date = opts.date;
		if (!date) {
			date = new Date();
		}
		var time = date.getTime() / 1000;
		if (opts.delay) {
			var delay = opts.delay;
			if (delay.seconds) {
				time += delay.seconds;
			}
			if (delay.minutes) {
				time += delay.minutes * 60;
			}
			if (delay.hours) {
				time += delay.hours * 60 * 60;
			}
			if (delay.days) {
				time += delay.days * 60 * 60 * 24;
			}
		}
		opts.utc = time;

		if (typeof opts.userDefined === "object") {
			opts.userDefined = JSON.stringify(opts.userDefined);
		} else {
			opts.userDefined = '{"value":"' + opts.userDefined + '"}';
		}

		nativeSendEvent("LocalNotifyPlugin", "Add", JSON.stringify(opts));
	}
});

exports = new LocalNotify();

