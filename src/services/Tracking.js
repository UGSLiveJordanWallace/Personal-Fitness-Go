export default class TrackMiles {
    constructor() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
                this.latitude = position.coords.latitude;
                this.longitude = position.coords.longitude;
                console.log(this.latitude);
                console.log(this.longitude);
            }, () => {
                return "Did not receive users position";
            });
        }
    }

    startTracking() {
        const options = {
            enableHighAccuracy: true,
            maximumAge: 3000,
            timeout: 3000
        }

        navigator.geolocation.watchPosition(position => {
            console.log(position.coords.latitude);
            console.log(position.coords.longitude);
        })
    }

}