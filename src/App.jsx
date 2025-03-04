import StartGame from "./components/StartGame";

const App = () => {
  return (
    <div className="w-screen h-screen">
      <div className="absolute top-0 z-[-2] h-screen w-screen bg-[#000000] bg-[radial-gradient(#ffffff33_1px,#00091d_1px)] bg-[size:20px_20px]"></div>
      <StartGame />
    </div>
  );
};
export default App;
