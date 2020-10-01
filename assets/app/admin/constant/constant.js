angular.module('constant', [])

.constant('Modules', {'apps.users.list':{title:'Users'},'apps.users.upsert':{title:'User'},'apps.users.profile':{title:'User Profile'},'apps.adminSetup.mainMasters':{title:'Main Master'},'apps.adminSetup.subMasters':{title:'Sub Master'},'apps.adminSetup.notifications':{title:'Notifications'},'apps.adminSetup.settings':{title:'Settings'}})

.constant('ActiveFilterStatus', {ALL:'-1',ACTIVE:'true',DEACTIVE:'false'})

.constant('UserTypes', {ADMIN:1,DEVICE:2})

.constant('COLOR_CLASS', ['bg-skyblue','bg-orange','bg-primary','bg-success','bg-danger','bg-dkrgray','bg-warning'])

.constant('FileTypes', {ATTACHMENT_TYPE_IMAGE:1,ATTACHMENT_TYPE_VIDEO:2,ATTACHMENT_TYPE_DOCUMENT:3,ATTACHMENT_TYPE_AUDIO:4})

.constant('API_ENDPOINT', 'http://localhost:1370')

;