import Styles from "./Inspector.module.scss";
import { useContext, useEffect, useState } from "react";
import { TProfile } from "@/@types/profile";
import { defaultProfile } from "@/definition/profile";
import { generateUuid } from "@/libs/uuid";
import { colorContext } from "@/context/color";
import { promptContext } from "@/context/prompt";
import { windowContext } from "@/context/window";
import { createWindow } from "@/libs/createWindow";
import { Rename } from "@/components/rename/Rename";
import { caretContext } from "@/context/caret";

const Inspector = () => {
  const [selectedProfile, setSelectedProfile] = useState<number>(-1);
  const { colors, setColors } = useContext(colorContext);
  const { promptList, setPromptList } = useContext(promptContext);
  const { caret, setCaret } = useContext(caretContext);
  const { data, setWindowContext } = useContext(windowContext);
  const [profiles, setProfiles_] = useState<TProfile[]>([]);
  const setProfiles = (data: TProfile[]) => {
    setProfiles_(data);
    void window.api.store_profiles(data);
  };
  useEffect(() => {
    const load = async () => {
      setProfiles_(await window.api.load_profiles());
    };
    void load();
  }, [0]);
  if (
    !setColors ||
    !colors ||
    !setPromptList ||
    !promptList ||
    !caret ||
    !setCaret ||
    !data ||
    !setWindowContext
  )
    return <></>;
  const onClickAdd = () => {
    setProfiles([
      ...profiles,
      JSON.parse(JSON.stringify({ ...defaultProfile, id: generateUuid() })),
    ]);
  };
  const onClickLoad = () => {
    const target = profiles[selectedProfile];
    if (!target) return;
    setColors(target.color);
    setPromptList(target.prompt);
    setCaret(target.caret);
  };
  const onClickRemove = () => {
    const newProfiles = [
      ...profiles.slice(0, selectedProfile),
      ...profiles.slice(selectedProfile + 1),
    ];
    setProfiles(newProfiles);
    if (newProfiles.length >= selectedProfile)
      setSelectedProfile(newProfiles.length - 1);
  };
  const onClickSave = () => {
    const target = profiles[selectedProfile];
    if (!target) return;
    target.prompt = [...promptList];
    target.color = { ...colors };
    target.caret = caret;
    setProfiles(JSON.parse(JSON.stringify([...profiles])));
  };
  const onClickRename = () => {
    const uuid = generateUuid();
    const target = profiles[selectedProfile];
    if (!target) return;
    const rename = createWindow(
      "名前変更",
      <Rename
        id={uuid}
        value={target.name}
        onChange={(val) => {
          target.name = val;
        }}
      />,
      {
        uuid,
        closable: true,
        width: 200,
        height: 60,
      }
    );
    setWindowContext({ [uuid]: rename, ...data });
  };
  const onClickApply = () => {
    window.api.apply_tprofile(profiles[selectedProfile]);
  };
  if (selectedProfile === -1 && profiles.length > 0) {
    setSelectedProfile(0);
  }
  console.log(profiles);
  return (
    <div className={Styles.wrapper}>
      <select
        size={20}
        className={Styles.select}
        value={selectedProfile}
        onChange={(e) => setSelectedProfile(Number(e.target.value))}
      >
        {profiles.map((profile, index) => {
          return (
            <option key={profile.id} value={index}>
              {profile.name}
            </option>
          );
        })}
      </select>
      <div className={Styles.buttons}>
        <button onClick={onClickAdd}>追加</button>
        <button onClick={onClickLoad}>読み込み</button>
        <button onClick={onClickRemove}>削除</button>
        <button onClick={onClickRename}>名前変更</button>
        <button onClick={onClickSave}>保存</button>
        <button onClick={onClickApply}>適用</button>
      </div>
    </div>
  );
};
export { Inspector };
