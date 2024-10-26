import * as signalR from '@microsoft/signalr';

export class SignalRService {
    private hubConnections: { [key: string]: signalR.HubConnection } = {};
    private baseSignalRUrl: string;

    constructor(baseSignalRUrl: string) {
        this.baseSignalRUrl = baseSignalRUrl;
    }

    start(hubUrl: string, userId?: string): signalR.HubConnection {
        if (!this.hubConnections[hubUrl]) {
            const fullHubUrl = userId 
                ? `${this.baseSignalRUrl + hubUrl}?userId=${userId}`
                : this.baseSignalRUrl + hubUrl;

            const builder = new signalR.HubConnectionBuilder();
            const hubConnection = builder
                .withUrl(fullHubUrl)
                .withAutomaticReconnect()
                .build();

            hubConnection.start()
                .then(() => {})
                .catch(error => {
                    setTimeout(() => this.start(hubUrl, userId), 2000);
                });

            hubConnection.onreconnected(() => {});
            hubConnection.onreconnecting(() => {});
            hubConnection.onclose(() => {});

            this.hubConnections[hubUrl] = hubConnection;
        }
        return this.hubConnections[hubUrl];
    }

    invoke(hubUrl: string, procedureName: string, message: any, userId?: string, successCallBack?: (value: any) => void, errorCallBack?: (error: any) => void) {
        const connection = this.start(hubUrl, userId);
        connection.invoke(procedureName, message)
            .then(successCallBack)
            .catch(errorCallBack);
    }

    on(hubUrl: string, procedureName: string, callBack: (...message: any[]) => void, userId?: string) {
        const connection = this.start(hubUrl, userId);
        connection.on(procedureName, callBack);
    }

    off(hubUrl: string, procedureName: string, userId?: string) {
        const connection = this.start(hubUrl, userId);
        connection.off(procedureName);
    }
}
