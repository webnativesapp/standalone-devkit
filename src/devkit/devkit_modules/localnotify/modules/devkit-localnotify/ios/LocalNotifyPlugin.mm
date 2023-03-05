#import "LocalNotifyPlugin.h"
#import <UIKit/UILocalNotification.h>
#import "platform/log.h"

// TODO: Notifications will get lost if JavaScript never requests them

@implementation LocalNotifyPlugin

- (void) dealloc {
	self.pendingNotifications = nil;

	[super dealloc];
}

- (id) init {
	self = [super init];
	if (!self) {
		return nil;
	}

	self.pendingNotifications = [NSMutableArray array];

	return self;
}

- (void) cancelOldNotifications {
	// Cancel any notifications with the same name
	NSArray *notifications = [[UIApplication sharedApplication] scheduledLocalNotifications];
	for (int ii = 0, len = [notifications count]; ii < len; ++ii) {
		UILocalNotification *n = [notifications objectAtIndex:ii];

		// If expired,
		if ([n.fireDate timeIntervalSinceNow] <= 0) {
			NSLOG(@"{localNotify} Canceling expired notification");

			[[UIApplication sharedApplication] cancelLocalNotification:n];
		}
	}
}

- (void) onPause {
	NSLOG(@"{localNotify} Paused: Clearing icon badge counter");

	[[UIApplication sharedApplication] setApplicationIconBadgeNumber:0];
}

- (void) onResume {
	NSLOG(@"{localNotify} Resumed: Clearing icon badge counter");
	
	[[UIApplication sharedApplication] setApplicationIconBadgeNumber:0];
}

- (void) applicationDidBecomeActive:(UIApplication *)app {
	[self cancelOldNotifications];
}

- (void) cancelNotificationByName:(NSString *)name {
	// Cancel any notifications with the same name
	NSArray *notifications = [[UIApplication sharedApplication] scheduledLocalNotifications];
	for (int ii = 0, len = [notifications count]; ii < len; ++ii) {
		UILocalNotification *evt = [notifications objectAtIndex:ii];
		NSString *evtName = [evt.userInfo valueForKey:@"name"];

		if ((evtName != nil) && [name caseInsensitiveCompare:evtName] == NSOrderedSame) {
			[[UIApplication sharedApplication] cancelLocalNotification:evt];
		}
	}
}

- (UILocalNotification *) getNotificationByName:(NSString *)name {
	// Cancel any notifications with the same name
	NSArray *notifications = [[UIApplication sharedApplication] scheduledLocalNotifications];
	for (int ii = 0, len = [notifications count]; ii < len; ++ii) {
		UILocalNotification *evt = [notifications objectAtIndex:ii];
		NSString *evtName = [evt.userInfo valueForKey:@"name"];

		if ((evtName != nil) && [name caseInsensitiveCompare:evtName] == NSOrderedSame) {
			return evt;
		}
	}

	return nil;
}

- (NSDictionary *) getNotificationObject:(UILocalNotification *)n didLaunch:(bool)didLaunch shown:(bool)shown {
	// Convert fireDate to UTC integer in seconds
	NSNumber *utc = nil;
	if (n.fireDate != nil) {
		utc = [NSNumber numberWithInt:(int)([n.fireDate timeIntervalSince1970] + 0.5)];
	}

	return [NSDictionary dictionaryWithObjectsAndKeys:
			[n.userInfo valueForKey:@"name"],@"name",
			[NSNumber numberWithInteger:n.applicationIconBadgeNumber],@"number",
			(n.soundName != nil) ? n.soundName : [NSNull null],@"sound",
			(n.alertAction != nil) ? n.alertAction : [NSNull null],@"action",
			(n.alertBody != nil) ? n.alertBody : [NSNull null],@"text",
			(utc != nil) ? utc : [NSNull null],@"utc",
			(didLaunch ? kCFBooleanTrue : kCFBooleanFalse),@"launched",
			(shown ? kCFBooleanTrue : kCFBooleanFalse),@"shown",
			[n.userInfo valueForKey:@"userDefined"],@"userDefined", nil];
}

- (void) reportNotification:(UILocalNotification *)n didLaunch:(bool)didLaunch shown:(bool)shown {
	if (n != nil) {
		if (self.readyForNotifications == YES) {
			NSLOG(@"{localNotify} Reporting local notification");

			[[PluginManager get] dispatchJSEvent:[NSDictionary dictionaryWithObjectsAndKeys:
												  @"LocalNotify",@"name",
												  [self getNotificationObject:n didLaunch:didLaunch shown:shown],@"info", nil]];

			[[UIApplication sharedApplication] setApplicationIconBadgeNumber:0];
		} else {
			NSString *name = [n.userInfo valueForKey:@"name"];
			
			for (int ii = 0; ii < [self.pendingNotifications count]; ++ii) {
				UILocalNotification *evt = [self.pendingNotifications objectAtIndex:ii];
				NSString *evtName = [evt.userInfo valueForKey:@"name"];

				if ((evtName != nil) && [name caseInsensitiveCompare:evtName] == NSOrderedSame) {
					NSLOG(@"{localNotify} Refusing to store the same local notification twice");
					return;
				}
			}

			NSLOG(@"{localNotify} Storing new local notification");

			[self.pendingNotifications addObject:[NSDictionary dictionaryWithObjectsAndKeys:
												  n,@"notification",
												  (didLaunch ? kCFBooleanTrue : kCFBooleanFalse),@"launched", nil]];
		}
	}
}

- (void) didReceiveLocalNotification:(UILocalNotification *)notification application:(UIApplication *)app {
	// Detect if notification launched the app
	bool didLaunch = app.applicationState == UIApplicationStateInactive ||
					 app.applicationState == UIApplicationStateBackground;

	[self reportNotification:notification didLaunch:didLaunch shown:didLaunch];
}

- (void) initializeWithManifest:(NSDictionary *)manifest appDelegate:(TeaLeafAppDelegate *)appDelegate {
	@try {
		TeaLeafAppDelegate *app = (TeaLeafAppDelegate *)[[UIApplication sharedApplication] delegate];

		[self reportNotification:app.launchNotification didLaunch:true shown:true];
	}
	@catch (NSException *exception) {
		NSLOG(@"{localNotify} WARNING: Exception during initialization: %@", exception);
	}
}

- (void) Ready:(NSDictionary *)jsonObject {
	@try {
		NSLOG(@"{localNotify} Ready received.  Sending queued events");

		// Flag ready
		self.readyForNotifications = YES;

		// Send all pending
		for (int ii = 0, len = [self.pendingNotifications count]; ii < len; ++ii) {
			NSDictionary *dict = [self.pendingNotifications objectAtIndex:ii];
			UILocalNotification *n = [dict objectForKey:@"notification"];
			[self reportNotification:n didLaunch:[dict objectForKey:@"launched"] shown:true];
		}

		// Remove pending
		[self.pendingNotifications removeAllObjects];
	}
	@catch (NSException *exception) {
		NSLOG(@"{localNotify} WARNING: Exception during Ready: %@", exception);
	}
}

- (void) List:(NSDictionary *)jsonObject {
	@try {
		NSLOG(@"{localNotify} List requested");

		NSArray *notifications = [[UIApplication sharedApplication] scheduledLocalNotifications];
		int count = [notifications count];
		
		NSMutableArray *results = [NSMutableArray arrayWithCapacity:count];

		for (int ii = 0; ii < count; ++ii) {
			UILocalNotification *evt = [notifications objectAtIndex:ii];

			[results setObject:[self getNotificationObject:evt didLaunch:false shown:false] atIndexedSubscript:ii];
		}

		[[PluginManager get] dispatchJSEvent:[NSDictionary dictionaryWithObjectsAndKeys:
											  @"LocalNotifyList",@"name",
											  results,@"list", nil]];
	}
	@catch (NSException *exception) {
		NSLOG(@"{localNotify} WARNING: Exception during List: %@", exception);

		[[PluginManager get] dispatchJSEvent:[NSDictionary dictionaryWithObjectsAndKeys:
											  @"LocalNotifyList",@"name",
											  [NSNull null],@"list",
											  exception,@"error", nil]];
	}
}

- (void) Get:(NSDictionary *)jsonObject {
	NSString *name = [jsonObject valueForKey:@"name"];

	@try {
		NSLOG(@"{localNotify} Get requested for %@", name);

		UILocalNotification *n = [self getNotificationByName:name];

		if (n == nil) {
			[[PluginManager get] dispatchJSEvent:[NSDictionary dictionaryWithObjectsAndKeys:
												  @"LocalNotifyGet",@"name",
												  [NSDictionary dictionaryWithObjectsAndKeys:
												   name,@"name", nil],@"info",
												  @"not found",@"error", nil]];
		} else {
			[[PluginManager get] dispatchJSEvent:[NSDictionary dictionaryWithObjectsAndKeys:
												  @"LocalNotifyGet",@"name",
												  [self getNotificationObject:n didLaunch:false shown:false],@"info", nil]];
		}
	}
	@catch (NSException *exception) {
		NSLOG(@"{localNotify} WARNING: Exception during Get: %@", exception);
		
		[[PluginManager get] dispatchJSEvent:[NSDictionary dictionaryWithObjectsAndKeys:
											  @"LocalNotifyGet",@"name",
											  [NSDictionary dictionaryWithObjectsAndKeys:
											   name,@"name", nil],@"info",
											  exception,@"error", nil]];
	}
}

- (void) Clear:(NSDictionary *)jsonObject {
	@try {
		NSLOG(@"{localNotify} Clearing all notifications");

		[[UIApplication sharedApplication] cancelAllLocalNotifications];

		[[UIApplication sharedApplication] setApplicationIconBadgeNumber:0];
	}
	@catch (NSException *exception) {
		NSLOG(@"{localNotify} WARNING: Exception during Clear: %@", exception);
	}
}

- (void) Remove:(NSDictionary *)jsonObject {
	@try {
		NSString *name = [jsonObject valueForKey:@"name"];

		NSLOG(@"{localNotify} Remove requested for %@", name);

		[self cancelNotificationByName:name];
	}
	@catch (NSException *exception) {
		NSLOG(@"{localNotify} WARNING: Exception during Remove: %@", exception);
	}
}

- (void) Add:(NSDictionary *)jsonObject {
	@try {
		NSString *name = [jsonObject valueForKey:@"name"];

		NSLOG(@"{localNotify} Add requested for %@", name);

		NSString *text = [jsonObject valueForKey:@"text"];
		NSNumber *number = [jsonObject valueForKey:@"number"];
		id sound = [jsonObject valueForKey:@"sound"];
		NSString *action = [jsonObject valueForKey:@"action"];
		NSNumber *utc = [jsonObject valueForKey:@"utc"];
		NSString *userDefined = [jsonObject valueForKey:@"userDefined"];

		// Construct notification from input
		UILocalNotification *n = [[UILocalNotification alloc] init];
		n.alertAction = action;
		n.hasAction = (action != nil);
		n.alertBody = text;
		n.applicationIconBadgeNumber = (number != nil) ? [number integerValue] : 0;
		if (sound != nil) {
			if ([sound isKindOfClass:[NSString class]]) {
				n.soundName = sound;
			} else if ([sound isKindOfClass:[NSNumber class]]) {
				NSNumber *num = sound;
				if ([num intValue] == 1) {
					n.soundName = UILocalNotificationDefaultSoundName;
				}
			}
		}
		n.userInfo = [NSDictionary dictionaryWithObjectsAndKeys:
					  userDefined,@"userDefined",
					  name,@"name", nil];

		// If fire date is specified,
		if (utc != nil) {
			NSDate *fireDate = [NSDate dateWithTimeIntervalSince1970:[utc integerValue]];

			// If date is in the past,
			if ([fireDate compare:[NSDate date]] == NSOrderedAscending) {
				NSLOG(@"{localNotify} Adding scheduled event %@ date in the past, so scheduling it immediately", name);

				utc = nil;
			} else {
				n.fireDate = fireDate;
				n.timeZone = [NSTimeZone defaultTimeZone];
			}
		}

		// Cancel existing one
		[self cancelNotificationByName:name];

		// If it should be scheduled in the future,
		if (utc != nil) {
			[[UIApplication sharedApplication] scheduleLocalNotification:n];
		} else {
			[[UIApplication sharedApplication] presentLocalNotificationNow:n];
		}
	}
	@catch (NSException *exception) {
		NSLOG(@"{localNotify} WARNING: Exception during Add: %@", exception);
	}
}

@end
