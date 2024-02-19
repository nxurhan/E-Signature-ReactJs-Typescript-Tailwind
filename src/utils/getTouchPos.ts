const getTouchPos = (canvas: any, event: any) => {
  const rect = canvas.getBoundingClientRect();
  return {
    x: event.touches[0].clientX - rect.left,
    y: event.touches[0].clientY - rect.top
  }
}

export default getTouchPos