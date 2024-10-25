import * as signalR from '@microsoft/signalr';

export class SignalRService {
    private hubConnections: { [key: string]: signalR.HubConnection } = {};
    private baseSignalRUrl: string;

    constructor(baseSignalRUrl: string) {
        this.baseSignalRUrl = baseSignalRUrl;
    }

    start(hubUrl: string): signalR.HubConnection {
        if (!this.hubConnections[hubUrl]) {
            const fullHubUrl = this.baseSignalRUrl + hubUrl;
            const builder = new signalR.HubConnectionBuilder();
            const hubConnection = builder
                .withUrl(fullHubUrl)
                .withAutomaticReconnect()
                .build();

            hubConnection.start()
                .then(() => console.log(`Connected to ${fullHubUrl}`))
                .catch(error => {
                    console.error('Connection failed: ', error);
                    setTimeout(() => this.start(hubUrl), 2000);
                });

            hubConnection.onreconnected(() => console.log('Reconnected to hub'));
            hubConnection.onreconnecting(() => console.log('Reconnecting to hub'));
            hubConnection.onclose(() => console.log('Connection closed'));

            this.hubConnections[hubUrl] = hubConnection;
        }
        return this.hubConnections[hubUrl];
    }

    invoke(hubUrl: string, procedureName: string, message: any, successCallBack?: (value: any) => void, errorCallBack?: (error: any) => void) {
        const connection = this.start(hubUrl);
        connection.invoke(procedureName, message)
            .then(successCallBack)
            .catch(errorCallBack);
    }

    on(hubUrl: string, procedureName: string, callBack: (...message: any[]) => void) {
        const connection = this.start(hubUrl);
        connection.on(procedureName, callBack);
    }

    off(hubUrl: string, procedureName: string) {
        const connection = this.start(hubUrl);
        connection.off(procedureName);
    }
}
