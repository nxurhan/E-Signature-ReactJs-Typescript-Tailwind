import Header from "./Header"
const Layout = (props: any) => (
  <section className="flex flex-col min-h-screen">
    <Header />
    <main className="flex-grow flex mt-auto pb-[80px] bg-[#E5E6F2]">{ props.children }</main>
    {/* <div className="absolute left-0 top-0 w-full h-full">
      <BackgroundImage />
    </div> */}
    
  </section>
)

export default Layout