import { ChangeEvent } from "react";
import "./Select.scss";

function Select({ options, onSelected }: { options: Array<{ name: string, key: string }>, onSelected: (e: ChangeEvent<HTMLSelectElement>) => void }) {
    return (
        <div className="select-container">
            <select className="select-field" onChange={onSelected} defaultValue={0}>
                <option disabled value={0}>Please select</option>
                {options.map((o) => { return (<option key={o.key} value={o.key}>{o.name}</option>); })}
            </select>
        </div>
    );
}

export default Select;