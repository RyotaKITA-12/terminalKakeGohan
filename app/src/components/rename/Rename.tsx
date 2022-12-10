import Styles from "./Rename.module.scss";
const Rename = ({ id }: { id: string }) => {
  return (
    <div className={Styles.wrapper}>
      <input type="text" />
      <button>OK</button>
    </div>
  );
};
export { Rename };
