const RadioInput = ({activateItem, name, clickHandler}:{
  activateItem: string; 
  name: string;
  clickHandler: (name: string) => void;
}) => {
  return (
    <section className="flex items-center cursor-pointer" onClick={() => clickHandler(name)}>
      <div className="flex-center w-[20px] h-[20px] mr-[10px] border border-[#595ED3] rounded-full">
        {
          activateItem === name
          ? <div className="w-[10px] h-[10px] bg-[#595ED3] rounded-full"></div>
          : null
        }
      </div>
      <h4>{ name }</h4>
    </section>
  )
}

export default RadioInput