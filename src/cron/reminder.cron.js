const cron = require('node-cron');
const {User: UserModel} = require('../api/models');
const sendEmail = require('../config/email');
User = UserModel.User; 

 // adjust path as needed

//  cron.schedule('* * * * *', async () => { 
//     sendEmail({
//         email: "saminasgigar@gmail.com",
//         subject: "Winners are grinners! 🏆",
//         payload: {
//             name: "Saminas",
//             message: "hello, some motivational message here! "
//         },
//         template: "notification.handlebars",
//     });
//  });
// // Daily task
// cron.schedule('0 0 * * *', async () => { // Runs every day at midnight
//   const users = await User.find({ notificationFrequency: 'daily' });
//   users.forEach(user => sendNotifications(user));
// });

// // Weekly task
// cron.schedule('0 0 * * 0', async () => { // Runs every Sunday at midnight
//   const users = await User.find({ notificationFrequency: 'weekly' });
//   users.forEach(user => sendNotifications(user));
// });

// // Monthly task
// cron.schedule('0 0 1 * *', async () => { // Runs the 1st day of every month at midnight
//   const users = await User.find({ notificationFrequency: 'monthly' });
//   users.forEach(user => sendNotifications(user));
// });

// async function sendNotifications(user) {
//   // Check user's notification preferences and send appropriate notifications
//   if (user.notificationTypes.includes('newMatch')) {
//     // Send newMatch notification
//   }
//   if (user.notificationTypes.includes('matchReminder')) {
//     // Send matchReminder notification
//   }
//   // Repeat for other notification types
// }