# Game Closure DevKit Plugin: Local Notifications

This plugin supports local notifications on iOS and Android platforms.

## Overview

Local notifications allow you to schedule messages to appear in the phone's
status area while your app is in the background or closed.

When delayed by a number of days, notifications are often used by games as a
re-engagement strategy.

The following features are common between notification systems:

+ text: Text describing the notification to the user.
+ delay: How far in the future to deliver the nofication (or immediately).
+ sound: A ringtone-like notification sound that alerts the user.

Local notifications have slightly different uses based on the target device:

#### iPhone/iPad

On iOS devices, local notifications are only practically useful for scheduling
notifications to appear in the iOS status area at some time in the future.

When local notifications are delivered and your app is open, they do not present
any visual indication. Instead, the event is delivered to the
`localNotify.onNotify` callback you can optionally specify (see below).

iOS-specific features:

+ action: Name of action for accepting notification. [iOS only]

For additional information see the [iOS Local Notifications Guide](http://developer.apple.com/library/ios/documentation/NetworkingInternet/Conceptual/RemoteNotificationsPG/Introduction.html#//apple_ref/doc/uid/TP40008194-CH1-SW1).

#### Android

Notifications appear in the status area with a number of features:

Android-specific features:

+ title: Title for alert is Android status area. [Android only]
+ vibrate: Vibrate the phone on receipt? [Android only]

For more overview see the [Android notification design pattern](http://developer.android.com/design/patterns/notifications.html) guide.

## Installation

Install the Local Notifications module using the standard devkit install process:

~~~
devkit install https://github.com/gameclosure/localnotify#v2.0.0
~~~

You can import the localNotify object anywhere in your application:

~~~
import localNotify;
~~~

## Scheduling Notifications

Notification objects have the following schema:

+ `name {string}` (REQUIRED) : Name of the notification.
+ `text {string}` (REQUIRED) : Text describing the notification to the user.
+ `sound {string}` (optional) : One of the following options:
    + undefined : No sound. (default)
    + true : Use default notification sound.

+ `action {string}` (optional, iOS-only) : Displayed at phone unlock screen as "Unlock to -action-".
+ `title {string}` (optional, Android-only) : Displayed as a title for the status line in the status area.
+ `vibrate {boolean}` (optional, Android-only) : Should vibrate on alarm?
+ `userDefined {object}` (optional) : User-defined object to store with the notification data.
+ `date {Date}` (optional) : Date when notification should trigger, or:
+ `delay {object}` (optional) : Convenience delay, a sum of:
    + `seconds {integer}` : Seconds to add to delay (may be fractional).
    + `minutes {integer}` : Minutes to add to delay (may be fractional).
    + `hours {integer}` : Hours to add to delay (may be fractional).
    + `days {integer}` : Days to add to delay (may be fractional).


For example:

~~~
var myNotification = {
    name: "unlock",
    sound: true,
    vibrate: true,
    action: "Unlock",
    title: "Unlocked a New Level",
    text: "You have blasted your way into the Carnage Kingdom!",
    delay: {
        seconds: 32,
        minutes: 1.5,
        hours: 2,
        days: 1
    },
    userDefined: {
        bought: false
    }
};
~~~

Notifications can be scheduled by passing them to the `localNotify.add`
function.

### Notification: Name

Adding a `name` field to your notification object is required.
When a notification is added it will over-write any existing notification with
the same name.

The name is used to reference the notification in the `remove` and `get`
functions, and it is included in the information returned from the `list`
function.

### Combining Notifications

You may choose to group gifts received from other players into a single
notification to avoid overwhelming the player by using the following code:

# localNotify object

## Members:

### localNotify.onNotify (evt)

+ `callback {function}` ---Set to your callback function.
    The first argument will be the object for the triggered notification.

Called whenever a local notification is accepted by the user.  This is the case
for notifications that trigger re-engagement while the app is closed.  In this
event the event(s) that triggered re-engagement will be delivered as soon as the
`onNotify` callback is set.

If `evt.launched` is true, then the notification caused your app to launch.
If `evt.shown` is true, then the notification was shown in the status bar.

~~~
localNotify.onNotify = function(evt) {
    if (evt.launched) {
        logger.log("Got event:", evt.name, "which launched the app");
    } else {
        logger.log("Got event:", evt.name);
    }
});
~~~

## Methods:

### localNotify.list (callback {function})

Parameters
:   `callback {function}` ---Callback function that will receive the list asynchronously.
            The first argument will be an array of pending notifications.

Returns
:    `void`

This function enables you to list any pending notifications that are scheduled
for delivery sometime in the future.

Any notifications that have triggered already will be delivered to the
`onNotify` member.

~~~
localNotify.list(function(notifications) {
    for (var ii = 0; ii < notifications.length; ++ii) {
        logger.log("Pending notification:", notifications[ii].name);
    }
});
~~~

### localNotify.get (name, callback {function})

Parameters
:   `name {string}` ---The notification name.
:    `callback {function}` ---Callback function that will receive the info asynchronously.
            The first argument will be the notification info.

Returns
:    `void`

This function enables you to get information about a notification by name.

~~~
localNotify.get("name", function(notification) {
    if (notification) {
        logger.log("Notification text:", notification.text);
    } else {
        logger.log("Notification DNE");
    }
});
~~~

### localNotify.clear

Parameters
:    `void`

Returns
:    `void`

Clears any pending notifications scheduled to be delivered in the future.

~~~
// Remove all notifications
localNotify.clear();
~~~

### localNotify.remove (name)

Parameters
:    `name {string}` ---Name of the notification to remove.

Returns
:    `void`

This function removes a scheduled notification by name.

~~~
localNotify.remove("name");
~~~

### localNotify.add (object)

Parameters
:    `event {object}` ---Notification event to deliver.

Returns
:    `void`

This function adds a notification to be delivered.  See above for the object
schema.

~~~
localNotify.add({
    name: "heart",
    action: "Accept",
    title: "Received Gift: Heart",
    text: "You have received a Heart from " + fromPlayer + "!"
});
~~~

