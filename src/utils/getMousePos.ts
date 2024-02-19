const getMousePos = (canvas: any, event: any): any => {
  const rect = canvas.getBoundingClientRect()
  return {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
  }
}

export default getMousePos