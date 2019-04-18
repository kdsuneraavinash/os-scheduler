function initChart(chartData) {
    // noinspection JSUnresolvedFunction
    am4core.useTheme(am4themes_material);
    am4core.useTheme(am4themes_animated);

    let chart = am4core.create("chartdiv-gantt", am4charts.XYChart);
    chart.hiddenState.properties.opacity = 0; // this creates initial fade-in
    chart.paddingRight = 30;
    chart.dateFormatter.inputDateFormat = "ss";

    let colorSet = new am4core.ColorSet();
    colorSet.saturation = 0.4;

    chart.data = chartData;

    let categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "name";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.inversed = true;

    let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.dateFormatter.dateFormat = "ss";
    dateAxis.renderer.minGridDistance = 70;
    dateAxis.baseInterval = {
        count: 1,
        timeUnit: "second"
    };
    dateAxis.strictMinMax = true;
    dateAxis.renderer.tooltipLocation = 0;

    let series = chart.series.push(new am4charts.ColumnSeries());
    series.columns.template.width = am4core.percent(80);
    series.columns.template.tooltipText = "{name}: {openDateX} - {dateX}";

    series.dataFields.openDateX = "start";
    series.dataFields.dateX = "end";
    series.dataFields.categoryY = "name";
    series.columns.template.propertyFields.fill = "color"; // get color from data
    series.columns.template.propertyFields.stroke = "color";
    series.columns.template.strokeOpacity = 1;

    chart.scrollbarX = new am4core.Scrollbar();
}

function initWaitingTime(chartData) {
    am4core.useTheme(am4themes_material);
    am4core.useTheme(am4themes_animated);
    var chart = am4core.create("chartdiv-waiting-time", am4charts.PieChart3D);
    chart.hiddenState.properties.opacity = 0;
    chart.paddingTop = 30;
    
    chart.data = chartData;

    chart.innerRadius = am4core.percent(40);
    chart.depth = 120;

    chart.legend = new am4charts.Legend();

    var series = chart.series.push(new am4charts.PieSeries3D());
    series.dataFields.value = "time";
    series.dataFields.depthValue = "time";
    series.dataFields.category = "process";
    series.slices.template.cornerRadius = 5;
    series.slices.template.propertyFields.fill = "color"; // get color from data
    series.slices.template.propertyFields.stroke = "color";
    series.colors.step = 3;
}