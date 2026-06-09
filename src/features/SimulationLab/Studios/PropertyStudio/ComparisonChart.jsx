// ComparisonChart.jsx
import { useEffect, useRef } from "react";
import styles from "../../Studios.module.css";

export default function ComparisonChart({ buyData, rentData, crossoverYear, timeHorizon }) {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    if (!buyData?.length || !rentData?.length) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const width = canvas.parentElement.clientWidth - 40;
    const height = 400;
    canvas.width = width;
    canvas.height = height;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Find max value for scaling
    const maxValue = Math.max(
      ...buyData.map(d => d.netWorth),
      ...rentData.map(d => d.netWorth),
      100000
    );
    
    const padding = { top: 20, right: 30, bottom: 40, left: 60 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;
    
    // Draw axes
    ctx.strokeStyle = "rgba(255,255,255,0.2)";
    ctx.fillStyle = "var(--clr-text)";
    ctx.font = "12px var(--font-body)";
    ctx.lineWidth = 1;
    
    // Y-axis
    ctx.beginPath();
    ctx.moveTo(padding.left, padding.top);
    ctx.lineTo(padding.left, height - padding.bottom);
    ctx.lineTo(width - padding.right, height - padding.bottom);
    ctx.stroke();
    
    // Y-axis labels (Rands)
    const ySteps = 5;
    for (let i = 0; i <= ySteps; i++) {
      const value = (maxValue / ySteps) * i;
      const y = height - padding.bottom - (i / ySteps) * chartHeight;
      ctx.fillStyle = "rgba(255,255,255,0.5)";
      ctx.fillText(`R${(value / 1000).toFixed(0)}k`, padding.left - 45, y + 4);
      
      ctx.beginPath();
      ctx.moveTo(padding.left - 5, y);
      ctx.lineTo(padding.left, y);
      ctx.stroke();
    }
    
    // X-axis labels (Years)
    for (let year = 1; year <= timeHorizon; year++) {
      const x = padding.left + (year / timeHorizon) * chartWidth;
      ctx.fillStyle = "rgba(255,255,255,0.5)";
      ctx.fillText(year, x - 5, height - padding.bottom + 20);
    }
    
    // Draw grid lines
    ctx.strokeStyle = "rgba(255,255,255,0.05)";
    ctx.lineWidth = 0.5;
    for (let i = 0; i <= ySteps; i++) {
      const y = height - padding.bottom - (i / ySteps) * chartHeight;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();
    }
    
    // Function to draw line
    const drawLine = (data, color) => {
      if (!data.length) return;
      
      ctx.beginPath();
      ctx.strokeStyle = color;
      ctx.lineWidth = 2.5;
      
      data.forEach((point, i) => {
        const x = padding.left + (point.year / timeHorizon) * chartWidth;
        const y = height - padding.bottom - (point.netWorth / maxValue) * chartHeight;
        
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      ctx.stroke();
      
      // Draw points
      data.forEach((point) => {
        const x = padding.left + (point.year / timeHorizon) * chartWidth;
        const y = height - padding.bottom - (point.netWorth / maxValue) * chartHeight;
        
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.arc(x, y, 4, 0, 2 * Math.PI);
        ctx.fill();
        ctx.shadowBlur = 0;
      });
    };
    
    // Draw lines
    drawLine(buyData, "#FFD700");
    drawLine(rentData, "#4A90D9");
    
    // Draw crossover point
    if (crossoverYear) {
      const crossoverBuy = buyData.find(d => d.year === crossoverYear);
      const crossoverRent = rentData.find(d => d.year === crossoverYear);
      
      if (crossoverBuy && crossoverRent) {
        const x = padding.left + (crossoverYear / timeHorizon) * chartWidth;
        const y = height - padding.bottom - (crossoverBuy.netWorth / maxValue) * chartHeight;
        
        ctx.beginPath();
        ctx.strokeStyle = "#FF6B6B";
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.moveTo(x, padding.top);
        ctx.lineTo(x, height - padding.bottom);
        ctx.stroke();
        ctx.setLineDash([]);
        
        // Crossover label
        ctx.fillStyle = "#FF6B6B";
        ctx.font = "bold 11px var(--font-body)";
        ctx.fillText(`Crossover Year ${crossoverYear}`, x - 50, padding.top + 20);
      }
    }
    
    // Legend
    ctx.fillStyle = "#FFD700";
    ctx.fillRect(width - 130, padding.top, 12, 12);
    ctx.fillStyle = "var(--clr-text)";
    ctx.fillText("Buying Net Worth", width - 115, padding.top + 10);
    
    ctx.fillStyle = "#4A90D9";
    ctx.fillRect(width - 130, padding.top + 20, 12, 12);
    ctx.fillStyle = "var(--clr-text)";
    ctx.fillText("Renting Net Worth", width - 115, padding.top + 30);
    
  }, [buyData, rentData, timeHorizon, crossoverYear]);
  
  return (
    <div className={styles.sectionCard}>
      <h2 className={styles.cardTitle}>Net Worth Comparison</h2>
      <p className={styles.cardSub}>
        {crossoverYear 
          ? `Buying becomes more beneficial than renting after year ${crossoverYear}`
          : `Renting remains more beneficial over your ${timeHorizon}-year horizon`}
      </p>
      <div className={styles.chartContainer}>
        <canvas ref={canvasRef} className={styles.chart}></canvas>
      </div>
    </div>
  );
}