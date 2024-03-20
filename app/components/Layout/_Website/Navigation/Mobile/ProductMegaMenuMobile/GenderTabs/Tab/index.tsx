type Props = {
  gender: string;
  setSelectedGender: React.Dispatch<React.SetStateAction<string | undefined>>;
  selectedGender?: string;
};

const Tab = ({ setSelectedGender, gender, selectedGender }: Props) => {
  return (
    <button
      type="button"
      className={`px-3 relative text-center w-full font-semibold tracking-wide border-brand-white/10 border min-h-[50px] flex items-center justify-center 
      ${selectedGender == gender ? "!border-white/75" : ""}`}
      onClick={() =>
        selectedGender !== gender
          ? setSelectedGender(gender)
          : setSelectedGender(undefined)
      }
    >
      {gender}
    </button>
  );
};

export default Tab;
