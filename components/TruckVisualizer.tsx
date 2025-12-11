import React from 'react';

interface TruckVisualizerProps {
  tireCount: number;
  selectedPos: number;
  onSelectPos: (pos: number) => void;
}

const TruckVisualizer: React.FC<TruckVisualizerProps> = ({ tireCount, selectedPos, onSelectPos }) => {
  
  // Helper to generate axle configuration
  const getAxles = () => {
    const axles = [];
    let currentTire = 1;

    // Front Axle (Always 2 tires: 1 Left, 2 Right)
    if (tireCount >= 2) {
      axles.push({
        id: 'front',
        left: [1],
        right: [2]
      });
      currentTire = 3;
    }

    // Rear Axles
    while (currentTire <= tireCount) {
      const remaining = tireCount - currentTire + 1;
      
      if (remaining >= 4) {
        // Dual Axle (4 tires)
        // Left: Outer(current), Inner(current+1)
        // Right: Inner(current+2), Outer(current+3)
        axles.push({
          id: `rear-${currentTire}`,
          left: [currentTire, currentTire + 1],
          right: [currentTire + 2, currentTire + 3]
        });
        currentTire += 4;
      } else if (remaining >= 2) {
         // Single Rear Axle (2 tires) e.g. Vans
         axles.push({
            id: `rear-${currentTire}`,
            left: [currentTire],
            right: [currentTire + 1]
         });
         currentTire += 2;
      } else {
         // Odd tire out
         axles.push({
             id: `rear-${currentTire}`,
             left: [currentTire],
             right: []
         });
         currentTire += 1;
      }
    }
    return axles;
  };

  const axles = getAxles();

  return (
    <div className="flex flex-col items-center py-6 bg-gray-50 rounded-xl border border-gray-200 shadow-inner">
      {/* Cabina */}
      <div className="w-32 h-16 bg-gray-300 rounded-t-2xl rounded-b-md border-4 border-gray-400 mb-1 relative shadow-sm z-10">
        <div className="absolute top-2 left-2 right-2 h-6 bg-blue-100/50 rounded-sm"></div>
        <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[10px] font-bold text-gray-500 tracking-wider">FRENTE</span>
      </div>

      {/* Chassis */}
      <div className="relative flex flex-col items-center gap-8 w-48">
         {/* Central Beam */}
         <div className="absolute top-[-10px] bottom-0 w-3 bg-gray-300 border-x border-gray-400 -z-0"></div>

         {axles.map((axle) => (
             <div key={axle.id} className="w-full flex justify-between items-center z-10 px-2">
                 {/* Left Tires */}
                 <div className="flex gap-1 justify-end w-1/2 pr-3">
                    {axle.left.map(tireId => (
                        <TireBox 
                            key={tireId} 
                            id={tireId} 
                            isSelected={selectedPos === tireId} 
                            onClick={() => onSelectPos(tireId)} 
                        />
                    ))}
                 </div>

                 {/* Axle Beam */}
                 <div className="absolute w-full h-2 bg-gray-400 -z-10 mx-4"></div>

                 {/* Right Tires */}
                 <div className="flex gap-1 justify-start w-1/2 pl-3">
                    {axle.right.map(tireId => (
                        <TireBox 
                            key={tireId} 
                            id={tireId} 
                            isSelected={selectedPos === tireId} 
                            onClick={() => onSelectPos(tireId)} 
                        />
                    ))}
                 </div>
             </div>
         ))}
      </div>
    </div>
  );
};

const TireBox: React.FC<{ id: number, isSelected: boolean, onClick: () => void }> = ({ id, isSelected, onClick }) => (
    <button
        onClick={onClick}
        className={`
            w-8 h-12 rounded-sm border-2 text-[10px] font-bold flex items-center justify-center transition-all duration-200 shadow-sm
            ${isSelected 
                ? 'bg-red-600 border-red-800 text-white scale-110 shadow-md ring-2 ring-red-200' 
                : 'bg-gray-800 border-gray-900 text-gray-400 hover:bg-gray-700'
            }
        `}
    >
        {id}
    </button>
);

export default TruckVisualizer;