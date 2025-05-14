export const LoginPage = () => {
  const handleLogin = () => {
    chrome.tabs.create({
      url: `${process.env.PLASMO_PUBLIC_MAIN_SITE}`
    })
  }

  return (
    <div className="flex flex-col w-full max-w-md text-center h-full items-center justify-center gap-y-4">
      <div className="text-3xl font-bold text-slate-900">Xdaily</div>
      <button
        onClick={handleLogin}
        className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 font-poppins bg-primary-brand text-white h-8 px-4 py-2 w-1/3">
        Sign In
      </button>
    </div>
  )
}
