export const chartTheme = {
  // Chart theme options
  chart: {
    background: 'transparent',
    foreColor: '#64748B',
    toolbar: {
      show: true,
      tools: {
        download: false,
      },
    },
    zoom: {
      enabled: true,
    },
  },
  // Theme specific colors
  colors: ['#3C50E0', '#80CAEE', '#F0950C', '#FF6766', '#10B981'],
  // Grid styling
  grid: {
    show: true,
    borderColor: '#E2E8F0',
    strokeDashArray: 0,
    position: 'back',
    xaxis: {
      lines: {
        show: true,
      },
    },
    yaxis: {
      lines: {
        show: true,
      },
    },
    padding: {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0,
    },
  },
  // Dark theme overrides
  theme: {
    mode: 'light',
    palette: 'palette1',
    monochrome: {
      enabled: false,
      color: '#3C50E0',
      shadeTo: 'light',
      shadeIntensity: 0.65,
    },
  },
  // Tooltip styling
  tooltip: {
    enabled: true,
    theme: 'light',
    style: {
      fontSize: '14px',
      fontFamily: 'Inter',
    },
  },
  // Legend styling
  legend: {
    show: true,
    position: 'bottom',
    horizontalAlign: 'center',
    floating: false,
    fontSize: '14px',
    fontFamily: 'Inter',
    fontWeight: 500,
    offsetY: 8,
    markers: {
      width: 8,
      height: 8,
      strokeWidth: 0,
      strokeColor: '#fff',
      radius: 12,
      offsetX: 0,
      offsetY: 0,
    },
    itemMargin: {
      horizontal: 10,
      vertical: 0,
    },
  },
  // Common axis options
  xaxis: {
    axisBorder: {
      show: false,
    },
    axisTicks: {
      show: false,
    },
    crosshairs: {
      show: true,
    },
    labels: {
      style: {
        fontSize: '14px',
        fontFamily: 'Inter',
        fontWeight: 500,
      },
    },
  },
  yaxis: {
    labels: {
      style: {
        fontSize: '14px',
        fontFamily: 'Inter',
        fontWeight: 500,
      },
    },
  },
  // Responsive settings
  responsive: [
    {
      breakpoint: 1536,
      options: {
        plotOptions: {
          bar: {
            borderRadius: 0,
            columnWidth: '25%',
          },
        },
      },
    },
  ],
};

// Dark mode theme overrides
export const darkChartTheme = {
  ...chartTheme,
  chart: {
    ...chartTheme.chart,
    foreColor: '#AEB7C0', // bodydark color
  },
  grid: {
    ...chartTheme.grid,
    borderColor: '#2E3A47', // strokedark color
  },
  theme: {
    ...chartTheme.theme,
    mode: 'dark',
  },
  tooltip: {
    ...chartTheme.tooltip,
    theme: 'dark',
  },
};

// Function to get theme based on dark mode
export const getChartTheme = (isDark: boolean) => {
  return isDark ? darkChartTheme : chartTheme;
}; 