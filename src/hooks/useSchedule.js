import { useState } from "react";

const useSchedule = () => {
    const [isScheduleMenuVisible, setIsScheduleMenuVisible] = useState(false);
    const [isSchedulePopupVisible, setIsSchedulePopupVisible] = useState(false);
    const [scheduleDateTime, setScheduleDateTime] = useState();

    return {
        isScheduleMenuVisible,
        isSchedulePopupVisible,
        scheduleDateTime,
        setIsScheduleMenuVisible,
        setIsSchedulePopupVisible,
        setScheduleDateTime,
    }
}

export default useSchedule
