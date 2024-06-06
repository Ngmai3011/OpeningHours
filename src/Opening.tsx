import importedData from "./data.json";
import {OpeningTime, WeekDay} from "./types";

const data: Record<WeekDay, OpeningTime[]> = importedData as Record<
  WeekDay,
  OpeningTime[]
>;

const openingTimeTransformer = (
  [first, second, ...rest]: OpeningTime[],
  next: OpeningTime[],
  result: OpeningTime[] = []
): OpeningTime[] => {
  if (first === undefined) {
    return result;
  }
  if (first.type === "close") {
    return openingTimeTransformer([second, ...rest], next, result);
  }
  if (
    first.type === "open" &&
    second === undefined &&
    next[0].type === "close"
  ) {
    result.push(first, next[0]);
    return openingTimeTransformer([second, ...rest], next, result);
  }

  if (first.type === "open" && second.type === "close") {
    result.push(first, second);
    return openingTimeTransformer(rest, next, result);
  }
  return result;
};

const result: Record<WeekDay, OpeningTime[]> = {
  monday: openingTimeTransformer(data.monday, data.tuesday),
  tuesday: openingTimeTransformer(data.tuesday, data.wednesday),
  wednesday: openingTimeTransformer(data.wednesday, data.thursday),
  thursday: openingTimeTransformer(data.thursday, data.friday),
  friday: openingTimeTransformer(data.friday, data.saturday),
  saturday: openingTimeTransformer(data.saturday, data.sunday),
  sunday: openingTimeTransformer(data.sunday, data.monday),
};

const convertTime = (seconds: number) => {
  const hours = Math.floor(seconds / 3600) % 12 || 12;
  const minutes = Math.floor((seconds % 3600) / 60);
  const period = Math.floor(seconds / 3600) < 12 ? "AM" : "PM";

  return `${hours}${minutes ? `:${minutes}` : ""} ${period}`;
};

const printOpeningTime = (day: OpeningTime[]) => {
  if (day.length !== 0) {
    const combinedArray = day.reduce(
      (result: string[], element: OpeningTime, index: number) => {
        if (index % 2 === 0) {
          result.push(convertTime(element.value));
        } else {
          result[result.length - 1] += ` - ${convertTime(element.value)}`;
        }
        return result;
      },
      []
    );
    return combinedArray.join(", ");
  }
  return <span className="closed">Closed</span>;
};

const printDay = (dayName: string) => {
  return `${dayName.charAt(0).toUpperCase() + dayName.slice(1)}`;
};

const printMarker = (index: number) => {
  const todayIndex = new Date().getDay() - 1;
  if (todayIndex === index || todayIndex + 7 === index)
    return <span className="today">TODAY</span>;
};

export default function Opening() {
  return (
    <div>
      {Object.entries(result).map((value, i) => (
        <div key={value[0]} className="day">
          <div className="day-name">
            {printDay(value[0])} {printMarker(i)}
          </div>
          <div className="day-value">{printOpeningTime(value[1])}</div>
        </div>
      ))}
    </div>
  );
}
