export default class TrackMiles {
    constructor() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                this.latitude = position.coords.latitude;
                this.longitude = position.coords.longitude;
            }, () => {
                return "Did not receive users position";
            });
        }
    }

    startTracking(callback, setWatchID) {
        const options = {
            enableHighAccuracy: true,
            timeout: 3000,
            maximumAge: 0
        }

        let currentMilesTraversed = 0;
        callback(currentMilesTraversed, this.latitude, this.longitude, null);

        var watchId = navigator.geolocation.watchPosition(position => {
            // Implementation for distance in miles latitude and longitude 
            // NM to M conversion factor 1.1508 NM = 1 M
            let newDistance = this.getDistance(this.latitude, this.longitude, position.coords.latitude, position.coords.longitude) * 1.1508;
            
            if (!isNaN(newDistance) && typeof(newDistance) !== undefined) {
                currentMilesTraversed += newDistance;
            } else {
                newDistance = 0;
            }

            callback(currentMilesTraversed, this.latitude, this.longitude, newDistance);
            setWatchID(watchId);

            // Reseting the position properties to new latitude and longitude values
            this.latitude = position.coords.latitude;
            this.longitude = position.coords.longitude;
        }, () => {
            navigator.geolocation.clearWatch(watchId);
            window.location.reload();
            console.log("Error occurred while watching position");
        }, options);
    }

    stopTracking(watchId) {
        navigator.geolocation.clearWatch(watchId);
    }

    // getDistance from latitude and longitude coordinates using NM Haversine Formula
    getDistance(lat1, long1, lat2, long2) {
        const R = 3440.1; // NM around the earth
        const nlat1 = this.degreesToRadians(lat1);
        const nlat2 = this.degreesToRadians(lat2);
        const nlong12 = this.degreesToRadians(long2 - long1);
        return Math.acos((Math.sin(nlat1) * Math.sin(nlat2)) + Math.cos(nlat1) * Math.cos(nlat2) * Math.cos(nlong12)) * R;
    }

    degreesToRadians(degrees) { 
        return degrees * (Math.PI/180);    
    }
}