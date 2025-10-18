import Image from "next/image";
import Logodevel from '../../../public/fcvicari.svg';

export function Rights() {
  return (
    <div className="flex justify-between pt-2 items-center w-full border-t-2 border-primary pb-2 text-[0.625rem] md:text-sm">
      <div className="flex flex-col">
        <span>All rights reserved.</span>
        <span>&copy; Vitaflow - Saúde personalizada. Vida equilibrada. 2025</span>
      </div>
      <div className="flex flex-col items-center justify-center content-center">
        <span>Developed by:</span>
        <Image alt="Developed by FCVicari Developer" src={Logodevel} />
      </div>
    </div>
  );
}
