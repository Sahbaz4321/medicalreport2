import React from "react";
import "../css/HealthCard.css";

const HealthScoreCard = ({ healthScore, riskLevel, metrics = [] }) => {

  const getRiskClass = () => {
    if (riskLevel?.toLowerCase() === "low") return "low-risk";
    if (riskLevel?.toLowerCase() === "medium") return "medium-risk";
    if (riskLevel?.toLowerCase() === "high") return "high-risk";
    return "default-risk";
  };

  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const progress = circumference - (healthScore / 100) * circumference;

  return (
    <div className={`health-card card shadow-lg p-4 mb-4 ${getRiskClass()}`}>

      <div className="row align-items-center">

        {/* SCORE CIRCLE */}

        <div className="col-md-4 text-center">

          <div className="position-relative d-inline-block">

            <svg width="180" height="180">

              <circle
                cx="90"
                cy="90"
                r={radius}
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="12"
                fill="none"
              />

              <circle
                cx="90"
                cy="90"
                r={radius}
                stroke="white"
                strokeWidth="12"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={progress}
                transform="rotate(-90 90 90)"
                style={{ transition: "stroke-dashoffset 1s" }}
              />

            </svg>

            <div className="score-text">

              <h2 className="fw-bold">{healthScore}</h2>
              <small>Health Score</small>

            </div>

          </div>

        </div>


        {/* INFO */}

        <div className="col-md-8">

          <h4 className="fw-bold mb-2">
            Overall Health Status
          </h4>

          <p className="mb-4">
            Risk Level: <strong>{riskLevel}</strong>
          </p>

          {/* METRICS */}

          {metrics.map((metric, index) => {

            const percentage = Math.min(metric.value, 100);

            return (
              <div key={index} className="mb-3">

                <div className="d-flex justify-content-between small mb-1">

                  <span>{metric.label}</span>

                  <span>
                    {metric.value} {metric.unit}
                  </span>

                </div>

                <div className="progress metric-bar">

                  <div
                    className="progress-bar bg-light"
                    style={{ width: `${percentage}%` }}
                  />

                </div>

              </div>
            );
          })}

        </div>

      </div>

    </div>
  );
};

export default HealthScoreCard;