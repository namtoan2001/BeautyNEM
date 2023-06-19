interface Message {
  body: string;
  sound: string;
  data: object;
}

export async function sendPushNotification(
  expoPushToken: string,
  message: Message
) {
  const _message = {
    to: expoPushToken,
    title: "BeautyNEM",
    sound: message.sound,
    body: message.body,
    data: message.data,
  };

  return await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(_message),
  });
}
