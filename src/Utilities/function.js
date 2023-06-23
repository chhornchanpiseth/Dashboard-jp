export const formatPlateTimeDate = (data) => {
  // console.log('format', data)
  data.forEach((x) => {
    x.image = x.time
    x.date = x.time.slice(0, 10);
    x.timing = x.time.slice(11, 19);
  })
}
