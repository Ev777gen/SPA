export let localeDate = (timestamp) => {
  // Конвертируем временную метку в строку:
  // toLocaleString() - дата + время
  // toLocaleDateString() - дата 
  // toLocaleTimeString() - время
  const isTimestampInSeconds = timestamp < 10000000000;
  if (isTimestampInSeconds) {
    timestamp *= 1000;
  }
  return (new Date(timestamp)).toLocaleDateString();
}