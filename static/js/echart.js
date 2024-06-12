// // Initialize Swiper
// var swiper = new Swiper('.swiper-container', {
//     pagination: {
//         el: '.swiper-pagination',
//     },
// });
//
// // Initialize ECharts instances and set options
// var chart1 = echarts.init(document.getElementById('chart1'));
// var chart2 = echarts.init(document.getElementById('chart2'));
// var chart3 = echarts.init(document.getElementById('chart3'));
// var chart4 = echarts.init(document.getElementById('chart4'));
//
// var option = {
//     title: {
//         text: 'Sample Chart'
//     },
//     tooltip: {},
//     xAxis: {
//         data: ['A', 'B', 'C', 'D', 'E']
//     },
//     yAxis: {},
//     series: [{
//         type: 'bar',
//         data: [5, 20, 36, 10, 10]
//     }]
// };
//
// // Set options for each chart
// chart1.setOption(option);
// chart2.setOption(option);
// chart3.setOption(option);
// chart4.setOption(option);
//
// // Add event listeners to navigation buttons
// document.getElementById('prevSlide').addEventListener('click', function () {
//     swiper.slidePrev();
// });
//
// document.getElementById('nextSlide').addEventListener('click', function () {
//     swiper.slideNext();
// });