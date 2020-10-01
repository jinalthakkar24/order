(function () {
    'use strict';
    angular
        .module('app')
        .constant("MODULE", [
            {
                identity: "ApiLog",
                module  : 1
            },
            {
                identity: "AppContent",
                module  : 2
            },
            {
                identity: "Contacts",
                module  : 3
            },
            {
                identity: "DeleteSync",
                module  : 4
            },
            {
                identity: "JobMatchCleaner",
                module  : 5
            },
            {
                identity: "JobQuestionnaire",
                module  : 6
            },
            {
                identity: "JobRequest",
                module  : 7
            },
            {
                identity: "Location",
                module  : 8
            },
            {
                identity: "MapCleanerServiceAddress",
                module  : 9
            },
            {
                identity: "Master",
                module  : 10
            },
            {
                identity: "Notification",
                module  : 11
            },
            {
                identity: "TransactionLog",
                module  : 12
            },
            {
                identity: "RateCard",
                module  : 13
            },
            {
                identity: "Rating",
                module  : 14
            },
            {
                identity: "RatingSummary",
                module  : 15
            },
            {
                identity: "Roles",
                module  : 16
            },
            {
                identity: "SeriesGenerator",
                module  : 17
            },
            {
                identity: "Service",
                module  : 18
            },
            {
                identity: "ServiceQuestionnaireMaster",
                module  : 19
            },
            {
                identity: "Setting",
                module  : 20
            },
            {
                identity: "Template",
                module  : 21
            },
            {
                identity: "User",
                module  : 22
            }, {
                identity: "UserDocuments",
                module  : 23
            },
            {
                identity: "ActionQuestionnaireMaster",
                module  : 24
            },
            {
                identity: "JobComplaintDispute",
                module  : 25
            }


        ])
        .constant("NavMenuListModules", {
            "DASHBOARD"         : {
                "id"         : 1,
                "name"       : "Dashboard",
                "permissions": {
                    "list"       : true,
                    "insert"     : false,
                    "update"     : false,
                    "delete"     : false,
                    "uploadExcel": false
                }
            },
            "ONGOING_JOB"       : {
                "id"         : 2,
                "module"     : "JobRequest",
                "name"       : "Ongoing Job",
                "permissions": {
                    "list"       : true,
                    "insert"     : true,
                    "update"     : true,
                    "delete"     : true,
                    "uploadExcel": true
                }
            },
            "HEAT_MAP"          : {
                "id"         : 3,
                "name"       : "Heat Map",
                "permissions": {
                    "list"       : true,
                    "insert"     : true,
                    "update"     : true,
                    "delete"     : true,
                    "uploadExcel": true
                }
            },
            "APPROVED"          : {
                "id"         : 4,
                "module"     : "User",
                "name"       : " Cleaner Approved",
                "permissions": {
                    "list"       : true,
                    "insert"     : true,
                    "update"     : true,
                    "delete"     : true,
                    "uploadExcel": true
                }
            },
            "PENDING_APPROVAL"  : {
                "id"         : 5,
                "module"     : "User",
                "name"       : "Cleaner Pending Approval",
                "permissions": {
                    "list"       : true,
                    "insert"     : true,
                    "update"     : true,
                    "delete"     : true,
                    "uploadExcel": true
                }
            },
            "REJECTED"          : {
                "id"         : 6,
                "module"     : "User",
                "name"       : "Cleaner Rejected",
                "permissions": {
                    "list"       : true,
                    "insert"     : true,
                    "update"     : true,
                    "delete"     : true,
                    "uploadExcel": true
                }
            },
            "CUSTOMER_LIST"     : {
                "id"         : 7,
                "module"     : "User",
                "name"       : "Customer List",
                "permissions": {
                    "list"       : true,
                    "insert"     : true,
                    "update"     : true,
                    "delete"     : true,
                    "uploadExcel": true
                }
            },
            "CUSTOMER_COMPLAINT": {
                "id"         : 8,
                "name"       : "Customer Complaint",
                "permissions": {
                    "list"       : true,
                    "insert"     : true,
                    "update"     : true,
                    "delete"     : true,
                    "uploadExcel": true
                }
            },
            "JOB_HISTORY"       : {
                "id"         : 9,
                "module"     : "JobRequest",
                "name"       : "Job History",
                "permissions": {
                    "list"       : true,
                    "insert"     : true,
                    "update"     : true,
                    "delete"     : true,
                    "uploadExcel": true
                }
            },
            "JOB_COMPLAINT_DISPUTE"     : {
                "id"         : 10,
                "module"     : "JobComplaintDispute",
                "name"       : "Job Dispute",
                "permissions": {
                    "list"       : true,
                    "insert"     : true,
                    "update"     : true,
                    "delete"     : true,
                    "uploadExcel": true
                }
            },
            "JOB_REQUEST"       : {
                "id"         : 11,
                "module"     : "JobRequest",
                "name"       : "Job Request",
                "permissions": {
                    "list"       : true,
                    "insert"     : true,
                    "update"     : true,
                    "delete"     : true,
                    "uploadExcel": true
                }
            },
            "PAYMENT_RECEIVED"  : {
                "id"         : 12,
                "module"     : "TransactionLog",
                "name"       : "Payment Received",
                "permissions": {
                    "list"       : true,
                    "insert"     : true,
                    "update"     : true,
                    "delete"     : true,
                    "uploadExcel": true
                }
            },
            "PAYMENT_DISPATCH"  : {
                "id"         : 13,
                "module"     : "TransactionLog",
                "name"       : "Payment Dispatch",
                "permissions": {
                    "list"       : true,
                    "insert"     : true,
                    "update"     : true,
                    "delete"     : true,
                    "uploadExcel": true
                }
            },
            "PAYMENT_ESCROW"    : {
                "id"         : 14,
                "module"     : "TransactionLog",
                "name"       : "Payment Escrow",
                "permissions": {
                    "list"       : true,
                    "insert"     : true,
                    "update"     : true,
                    "delete"     : true,
                    "uploadExcel": true
                }
            },
            "PAYMENT_CANCELLED" : {
                "id"         : 15,
                "module"     : "TransactionLog",
                "name"       : "Payment Cancelled",
                "permissions": {
                    "list"       : true,
                    "insert"     : true,
                    "update"     : true,
                    "delete"     : true,
                    "uploadExcel": true
                }
            },
            "PAYMENT_REFUND"    : {
                "id"         : 16,
                "module"     : "TransactionLog",
                "name"       : "Payment Refund",
                "permissions": {
                    "list"       : true,
                    "insert"     : true,
                    "update"     : true,
                    "delete"     : true,
                    "uploadExcel": true
                }
            },
            "COMMISSION"        : {
                "id"         : 17,
                "name"       : "Commission",
                "permissions": {
                    "list"       : true,
                    "insert"     : true,
                    "update"     : true,
                    "delete"     : true,
                    "uploadExcel": true
                }
            },
            "USERS"             : {
                "id"         : 26,
                "module"     : "User",
                "name"       : "Users",
                "permissions": {
                    "list"       : true,
                    "insert"     : true,
                    "update"     : true,
                    "delete"     : true,
                    "uploadExcel": true
                }
            },
            "CONTACTS"          : {
                "id"         : 28,
                "module"     : "Contacts",
                "name"       : "Contacts",
                "permissions": {
                    "list"       : true,
                    "insert"     : true,
                    "update"     : true,
                    "delete"     : true,
                    "uploadExcel": true
                }
            },
            "TEMPLATE"          : {
                "id"         : 29,
                "module"     : "Template",
                "name"       : "Template",
                "permissions": {
                    "list"       : true,
                    "insert"     : true,
                    "update"     : true,
                    "delete"     : true,
                    "uploadExcel": true
                }
            },
            "NOTIFICATION"      : {
                "id"         : 30,
                "module"     : "Notification",
                "name"       : "Notification",
                "permissions": {
                    "list"       : true,
                    "insert"     : true,
                    "update"     : true,
                    "delete"     : true,
                    "uploadExcel": true
                }
            },
            "RATE_CARD"         : {
                "id"         : 22,
                "module"     : "RateCard",
                "name"       : "Rate Card",
                "permissions": {
                    "list"       : true,
                    "insert"     : false,
                    "update"     : false,
                    "delete"     : false,
                    "uploadExcel": false
                }
            },
            "SUB_SERVICES"      : {
                "id"         : 24,
                "module"     : "Service",
                "name"       : "Sub Services",
                "permissions": {
                    "list"       : true,
                    "insert"     : false,
                    "update"     : false,
                    "delete"     : false,
                    "uploadExcel": false
                }
            },
            "QUESTIONNAIRE"     : {
                "id"         : 25,
                "module"     : "ServiceQuestionnaireMaster",
                "name"       : "Questionnaire",
                "permissions": {
                    "list"       : true,
                    "insert"     : false,
                    "update"     : false,
                    "delete"     : false,
                    "uploadExcel": false
                }
            },
            "ROLES"             : {
                "id"         : 27,
                "module"     : "Roles",
                "name"       : "Roles",
                "permissions": {
                    "list"       : true,
                    "insert"     : false,
                    "update"     : false,
                    "delete"     : false,
                    "uploadExcel": false
                }
            }


        });
})();
