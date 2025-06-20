import { HubConnectionBuilder } from '@microsoft/signalr'

let connection = null

export const createNotificationHubConnection = (token) => {

    connection = new HubConnectionBuilder()
    .withUrl('http://localhost:5009/hub/notifications', {
      accessTokenFactory: () => token,
    })
    .withAutomaticReconnect()
    .build()

  return connection

}

export const getNotificationHubConnection = () => connection