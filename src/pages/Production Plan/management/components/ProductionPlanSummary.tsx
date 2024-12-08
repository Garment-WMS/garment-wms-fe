import React from 'react';
import { Gantt, Task, ViewMode, StylingOption } from 'gantt-task-react';
import 'gantt-task-react/dist/index.css';
import { ProductionPlan } from '@/types/ProductionPlan';
import Colors from '@/constants/color';
import { useNavigate } from 'react-router-dom';

interface ProductionPlanSummaryProps {
  productionPlanList: ProductionPlan[];
}

const ProductionPlanSummary: React.FC<ProductionPlanSummaryProps> = ({ productionPlanList }) => {
  const navigate = useNavigate();
  const maxDate = new Date(
    Math.max(...productionPlanList.map((plan) => new Date(plan.expectedEndDate).getTime()))
  );
  const adjustedMaxDate = new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate());
  const tasks: Task[] = productionPlanList.map((plan) => {
    const startDate = new Date(plan.expectedStartDate);
    const endDate = new Date(plan.expectedEndDate);
    const formattedStartDate = new Date(
      startDate.getFullYear(),
      startDate.getMonth(),
      startDate.getDate()
    );
    const formattedEndDate = new Date(Math.min(endDate.getTime(), adjustedMaxDate.getTime()));
    return {
      id: plan.id,
      name: plan.name,
      start: formattedStartDate,
      end: formattedEndDate,
      type: 'task',
      progress: 0,
      isDisabled: false,
      styles: {
        progressColor: '#4caf50',
        progressSelectedColor: '#388e3c',
        backgroundColor: Colors.primaryDarkBackgroundColor
      }
    };
  });

  const customStyling: StylingOption = {
    headerHeight: 50, // Makes the header larger
    ganttHeight: 400, // Sets Gantt chart height
    columnWidth: 280, // Reduce column width for smaller width
    listCellWidth: '', // Narrower name column
    rowHeight: 45, // Reduces row height for better spacing
    barCornerRadius: 5, // Adds rounded corners to bars
    barFill: 80, // 80% bar fill for better visibility
    handleWidth: 10, // Drag handle width
    fontFamily: 'Arial, sans-serif', // Sets font family
    fontSize: '12px', // Font size for chart text
    barBackgroundColor: '#d3d3d3', // Bar background color
    barBackgroundSelectedColor: '#b0b0b0', // Selected background color
    barProgressColor: '#4caf50', // Progress bar color
    barProgressSelectedColor: '#388e3c', // Selected progress color
    todayColor: Colors.green[500], // Highlight today's column
    arrowColor: '#9e9e9e', // Relationship arrow color
    arrowIndent: 15 // Space for arrow alignment
  };

  return (
    <section className="px-6 pt-6 pb-8 w-[75vw] bg-white rounded-xl shadow-md border">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-primaryLight">Production Plan Summary</h1>
      </div>
      <div className="gantt-chart-container" style={{ overflowX: 'auto' }}>
        <Gantt
          tasks={tasks}
          onClick={(task) => navigate(`/production-plan/${task.id}`)}
          viewMode={ViewMode.Year}
          locale="en-GB"
          columnWidth={customStyling.columnWidth}
          barCornerRadius={customStyling.barCornerRadius}
          rowHeight={customStyling.rowHeight}
          fontFamily={customStyling.fontFamily}
          fontSize={customStyling.fontSize}
          listCellWidth={customStyling.listCellWidth}
          todayColor={customStyling.todayColor}
        />
      </div>
    </section>
  );
};

export default ProductionPlanSummary;
