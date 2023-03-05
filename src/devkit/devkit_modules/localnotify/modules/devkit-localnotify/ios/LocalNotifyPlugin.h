#import "PluginManager.h"

@interface LocalNotifyPlugin : GCPlugin

@property (nonatomic, retain) NSMutableArray *pendingNotifications;
@property (nonatomic, assign) BOOL readyForNotifications;

- (void) cancelOldNotifications;

- (UILocalNotification *) getNotificationByName:(NSString *)name;
- (void) cancelNotificationByName:(NSString *)name;

- (NSDictionary *) getNotificationObject:(UILocalNotification *)notification didLaunch:(bool)didLaunch shown:(bool)shown;

- (void) reportNotification:(UILocalNotification *)notification didLaunch:(bool)didLaunch shown:(bool)shown;

@end

