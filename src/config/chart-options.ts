export const corsairPlugin = {
  id: "corsair",
  defaults: {
    width: 1,
    color: "grey",
    dash: [3, 3],
  },
  afterInit: (chart: any, args: any, opts: any) => {
    chart.corsair = {
      x: 0,
      y: 0,
    };
  },
  afterEvent: (chart: any, args: any) => {
    const { inChartArea } = args;
    const { type, x, y } = args.event;

    chart.corsair = { x, y, draw: inChartArea };
    chart.draw();
  },
  afterDraw: (chart: any, args: any, opts: any) => {
    const { ctx } = chart;
    const { top, bottom, left, right } = chart.chartArea;
    const { x, y, draw } = chart.corsair;
    if (!draw) return;

    ctx.save();
    ctx.beginPath();
    ctx.lineWidth = opts.width;
    ctx.strokeStyle = opts.color;
    ctx.setLineDash(opts.dash);
    ctx.moveTo(x, bottom);
    ctx.lineTo(x, top);
    ctx.moveTo(left, y);
    ctx.lineTo(right, y);
    ctx.stroke();
    ctx.restore();
  },
};

export const chartOptions = (type: string, labelType?: string) => {
  return {
    responsive: true,
    maintainAspectRatio: true,
    hover: {
      mode: "nearest",
      intersect: false,
    },
    plugins: {
      legend: {
        display: false,
        labels: {
          font: {
            family: "Verdana",
          },
        },
      },
      tooltip: {
        mode: "nearest",
        intersect: false,
        yAlign: "center",
        xAlign: "center",
      },
    },
    elements: {
      point: {
        radius: 5,
        hitRadius: 20,
        borderWidth: 3,
        hoverBorderWidth: 2,
      },
      line: {
        fill: true,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          autoSkip: true,
          maxTicksLimit: type === "price" ? 6 : 8,
          padding: 10,
          font: {
            family: "Verdana",
          },
        },
      },
      y: {
        position: type === "price" ? "right" : "left",
        beginAtZero: false,
        grid: {
          display: true,
        },
        ticks: {
          padding: 15,
          font: {
            family: "Verdana",
          },
          callback: function (value: number) {
            return labelType === "percent"
              ? (value * 100).toFixed(0).toString() + "%"
              : value.toFixed(2);
          },
        },
      },
    },
  };
};
