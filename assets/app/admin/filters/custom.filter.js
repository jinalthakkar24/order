(function () {
    'use strict';
    angular
        .module('app')
        .filter('buildAddress', buildAddress)
        .filter('arrayPrimaryValue', arrayPrimaryValue)
        .filter('customDateFmt', customDateFmt)
        .filter("appDateTime", appDateTime)
        .filter('appDate', appDate)                         // 'dd MMM, yyyy hh:mm a'
        .filter('appOnlyDate', appOnlyDate)                 // 'dd MMM, yyyy'
        .filter('onlyTime', onlyTime)                       // 'hh:mm a'
        .filter('timeStampToDate', timeStampToDate);        // 'dd MMM, yyyy hh:mm a'

    /* @ngInject */
    function buildAddress() {
        return function (obj) {
            if (obj) {
                var addressArr = ['line1', 'line2', 'city', 'state', 'country', 'postal_code'];
                var string = '';
                _.each(addressArr, function (v) {
                    if (obj[v] && obj[v] !== '') {
                        string += obj[v] + ', ';
                    }
                });
                return string.substring(0, string.length - 2);
            }
            else {
                return '';
            }
        };
    }

    /* @ngInject */
    function arrayPrimaryValue() {
        return function (arrayName, returnKey) {

            if (arrayName && arrayName.length) {
                var primary_value = _.findWhere(arrayName, {'is_primary': true});
                if (primary_value && _.isObject(primary_value) && !_.isEmpty(primary_value)) {
                    return primary_value[returnKey];
                }
                else {
                    return arrayName[0][returnKey];
                }
            }
        };
    }

    /* @ngInject */
    function customDateFmt() {
        return function (customDate) {
            if (customDate) {
                return moment(customDate).format('DD-MMM-YYYY HH:mm a');
            }
            return customDate;
        }
    }

    /* @ngInject */
    function appDate($filter) {
        return function (date) {
            return $filter('date')(date, 'dd MMM, yyyy hh:mm a');
        }
    }

    /* @ngInject */
    function appOnlyDate($filter) {
        return function (date) {
            return $filter('date')(date, 'dd MMM, yyyy');
        }
    }

    /* @ngInject */
    function onlyTime($filter) {
        return function (timestamp) {
            if (timestamp) {
                var date = moment(timestamp).toISOString();
                return $filter('date')(date, 'hh:mm a');
            }
            return timestamp;
        }
    }

    /* @ngInject */
    function timeStampToDate($filter) {
        return function (timestamp) {
            var date = moment(timestamp).toISOString();
            return $filter('date')(date, 'dd MMM, yyyy hh:mm a');
        }
    }

    /* @ngInject */
    function appDateTime($filter) {
        return function (date) {
            return $filter("date")(date, "dd MMM, yyyy hh:mm a");
        };
    }

})();
