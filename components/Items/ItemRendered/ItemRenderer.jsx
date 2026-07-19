import { memo } from "react";
import GoalItem from "../Item/GoalItem/GoalItem";
import HabitItem from "../Item/HabitItem/HabitItem";

const ItemRenderer = memo(function ItemRenderer({ item, ...props }) {
    switch (item.type) {
        case "goal":
            return <GoalItem item={item} {...props} />;
        case "habit":
            return <HabitItem item={item} {...props} />;
        default:
            return null;
    }
});

export default ItemRenderer;
