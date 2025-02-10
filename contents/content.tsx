import cssText from "data-text:~/styles/global.css"

export const getStyle = () => {
  const style = document.createElement("style")
  style.textContent = cssText
  return style
}

const CustomButton = () => {
  return (
    <button className="fixed top-0 left-1/2 -translate-x-1/2 z-100 bg-red-300 text-white">
      Custom button
    </button>
  )
}

export default CustomButton
