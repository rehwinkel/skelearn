import { ChangeEvent } from "react";
import "./Select.scss";

function Select({ options, onSelected }: { options: Array<string>, onSelected: (e: ChangeEvent<HTMLSelectElement>) => void }) {
    return (
        <div className="select-container">
            <select className="select-field" onChange={onSelected} defaultValue={0}>
                <option disabled value={0}>Please select</option>
                {options.map((o) => { return (<option key={o} value={o}>{o}</option>); })}
            </select>
        </div>
    );
}

export default Select;