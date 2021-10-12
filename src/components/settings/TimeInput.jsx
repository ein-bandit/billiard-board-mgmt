import React from 'react';
import moment from 'moment';
import * as mdDateTimePicker from '../../../node_modules/md-date-time-picker/dist/js/mdDateTimePicker';

var dialog = new mdDateTimePicker.default({
    type: 'time',
    mode: true,
});

const TimeInput = ({ time, updateTime }) => {
    const inputRef = React.createRef();

    const handle = React.useCallback(() => {
        dialog.trigger = null;
        updateTime(dialog.time.format('HH:mm'));
    }, [updateTime]);

    const openTime = React.useCallback(() => {
        dialog.trigger = inputRef.current;
        dialog.time = moment(time, 'HH:mm');
        dialog.toggle();
    }, [inputRef, time]);

    React.useEffect(() => {
        const ref = inputRef.current;
        ref.addEventListener('onOk', handle);

        return () => {
            ref.removeEventListener('onOk', handle);
        };
    }, [inputRef, handle]);

    return (
        <div className="input-group col">
            <input type="text" className="form-control" placeholder="n/a" value={time} ref={inputRef} onChange={() => {}} onClick={openTime} />
            <div className="input-group-append" style={{ cursor: 'pointer' }} onClick={openTime}>
                <span className="input-group-text" id="basic-addon2">
                    <i className="fa fa-clock-o"></i>
                </span>
            </div>
        </div>
    );
};

export default TimeInput;
