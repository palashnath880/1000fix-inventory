import img from "../../assets/logo.webp";

export default function Loader() {
  return (
    <div className="w-screen h-screen grid place-items-center">
      <img src={img} draggable={false} className="animate-pulse w-40" />
    </div>
  );
}
