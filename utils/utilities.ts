export function formatDate(input: string) {
  const date = new Date(input);

  const day = date.toLocaleString("en-GB", { day: "2-digit" });
  const month = date.toLocaleString("en-GB", { month: "short" });
  const year = date.toLocaleString("en-GB", { year: "numeric" });

  return `${month} ${day}, ${year}`;
}

export function getProjectColor(index: number) {
  const colors = [
    "#FCDAD8", // soft red
    "#FDF2C7", // soft yellow
    "#DDF4E1", // soft green
    "#DDEBFA", // soft blue
    "#F2DAF9", // soft purple
  ];

  return colors[index % colors.length];
}
