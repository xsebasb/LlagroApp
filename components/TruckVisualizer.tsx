import React, { useMemo, useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Environment, Html, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

// Fix for missing types in JSX.IntrinsicElements for React Three Fiber
// This handles cases where @react-three/fiber types aren't properly picking up the global JSX namespace augmentation
declare global {
  namespace JSX {
    interface IntrinsicElements {
      group: any;
      mesh: any;
      cylinderGeometry: any;
      meshStandardMaterial: any;
      boxGeometry: any;
      ambientLight: any;
      spotLight: any;
    }
  }
}

interface TruckVisualizerProps {
  tireCount: number;
  selectedPos: number;
  onSelectPos: (pos: number) => void;
}

// --- 3D Components ---

const Tire3D = ({ position, id, isSelected, onClick }: { position: [number, number, number], id: number, isSelected: boolean, onClick: () => void }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHover] = useState(false);

  // Animation for selection
  useFrame((state) => {
    if (meshRef.current) {
        // Slight pulse if selected
        const scale = isSelected ? 1.1 + Math.sin(state.clock.elapsedTime * 5) * 0.05 : hovered ? 1.05 : 1;
        meshRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <group position={position}>
      {/* Tire Mesh */}
      <mesh
        ref={meshRef}
        rotation={[0, 0, Math.PI / 2]}
        onClick={(e) => { e.stopPropagation(); onClick(); }}
        onPointerOver={() => setHover(true)}
        onPointerOut={() => setHover(false)}
      >
        <cylinderGeometry args={[0.35, 0.35, 0.25, 32]} />
        <meshStandardMaterial 
            color={isSelected ? '#ef4444' : '#202020'} 
            roughness={0.8}
            metalness={0.2}
        />
      </mesh>
      
      {/* Rim Mesh */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.2, 0.2, 0.26, 16]} />
          <meshStandardMaterial color="#b0b0b0" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Label */}
      <Html position={[0, 0.5, 0]} center distanceFactor={10}>
        <div 
          className={`px-2 py-0.5 rounded-full text-[10px] font-bold shadow-sm transition-all border ${
            isSelected 
            ? 'bg-red-600 text-white border-red-700 scale-110' 
            : 'bg-white/90 text-gray-800 border-gray-300'
          }`}
          style={{ pointerEvents: 'none', userSelect: 'none' }}
        >
          {id}
        </div>
      </Html>
    </group>
  );
};

const TruckChassis = ({ length }: { length: number }) => {
  return (
    <group>
        {/* Main Beams */}
        <RoundedBox args={[0.8, 0.2, length]} radius={0.05} smoothness={4} position={[0, 0, -length/2 + 1.5]}>
            <meshStandardMaterial color="#1b4332" metalness={0.6} roughness={0.4} />
        </RoundedBox>
        
        {/* Cross Members */}
        {Array.from({ length: Math.floor(length / 1.5) }).map((_, i) => (
             <mesh key={i} position={[0, 0, 1 - i * 1.5]}>
                 <boxGeometry args={[1.2, 0.1, 0.1]} />
                 <meshStandardMaterial color="#2d3748" />
             </mesh>
        ))}
    </group>
  );
};

const TruckCabin = () => {
    return (
        <group position={[0, 0.6, 2]}>
            {/* Main Body */}
            <RoundedBox args={[2.2, 2.0, 1.8]} radius={0.1} smoothness={4} position={[0, 0.5, 0]}>
                <meshStandardMaterial color="#1b4332" metalness={0.4} roughness={0.2} />
            </RoundedBox>
            
            {/* Windshield */}
            <mesh position={[0, 1.0, 0.91]}>
                <boxGeometry args={[2.0, 0.8, 0.1]} />
                <meshStandardMaterial color="#a5d8ff" transparent opacity={0.6} roughness={0} metalness={0.9} />
            </mesh>

            {/* Grill */}
            <mesh position={[0, -0.2, 0.91]}>
                <boxGeometry args={[1.8, 0.6, 0.05]} />
                <meshStandardMaterial color="#1a1a1a" />
            </mesh>
             
            {/* Bumper */}
            <RoundedBox args={[2.4, 0.4, 0.5]} radius={0.1} smoothness={4} position={[0, -0.8, 0.8]}>
                <meshStandardMaterial color="#2d3748" metalness={0.5} roughness={0.8} />
            </RoundedBox>
        </group>
    );
};

const TruckScene = ({ tireCount, selectedPos, onSelectPos }: TruckVisualizerProps) => {
    // Generate Tire Positions based on count
    const { tires, chassisLength } = useMemo(() => {
        const tiresList = [];
        
        // Front Axle (Always present)
        // Pos 1: Left, Pos 2: Right
        // We assume Z=2.0 is the front axle position relative to center
        const frontZ = 2.0;
        tiresList.push({ id: 1, pos: [-1.0, 0.35, frontZ] as [number, number, number] });
        tiresList.push({ id: 2, pos: [1.0, 0.35, frontZ] as [number, number, number] });

        let currentTire = 3;
        let rearZ = -1.5; // Start of rear axles
        const axleSpacing = 1.4;

        while(currentTire <= tireCount) {
            const remaining = tireCount - currentTire + 1;
            
            if (remaining >= 4) {
                // Dual Axle
                // Left Outer (curr), Left Inner (curr+1)
                // Right Inner (curr+2), Right Outer (curr+3)
                tiresList.push({ id: currentTire, pos: [-1.6, 0.35, rearZ] as [number, number, number] });
                tiresList.push({ id: currentTire + 1, pos: [-1.05, 0.35, rearZ] as [number, number, number] });
                tiresList.push({ id: currentTire + 2, pos: [1.05, 0.35, rearZ] as [number, number, number] });
                tiresList.push({ id: currentTire + 3, pos: [1.6, 0.35, rearZ] as [number, number, number] });
                
                currentTire += 4;
            } else if (remaining >= 2) {
                // Single Axle
                tiresList.push({ id: currentTire, pos: [-1.6, 0.35, rearZ] as [number, number, number] });
                tiresList.push({ id: currentTire + 1, pos: [1.6, 0.35, rearZ] as [number, number, number] });
                currentTire += 2;
            } else {
                 // Odd one
                 tiresList.push({ id: currentTire, pos: [0, 0.35, rearZ - 1] as [number, number, number] }); // Spare?
                 currentTire += 1;
            }
            rearZ -= axleSpacing;
        }

        // Calculate needed chassis length based on the last axle
        const lastAxleZ = rearZ + axleSpacing; // Correct offset
        const totalLength = (frontZ - lastAxleZ) + 2.0; // Margin

        return { tires: tiresList, chassisLength: totalLength };

    }, [tireCount]);

    return (
        <group>
            <TruckCabin />
            <TruckChassis length={chassisLength} />
            
            {tires.map((t) => (
                <Tire3D 
                    key={t.id}
                    id={t.id}
                    position={t.pos}
                    isSelected={selectedPos === t.id}
                    onClick={() => onSelectPos(t.id)}
                />
            ))}
            
            <ContactShadows resolution={1024} scale={20} blur={2} opacity={0.25} far={10} color="#000000" />
        </group>
    );
};

const TruckVisualizer: React.FC<TruckVisualizerProps> = (props) => {
  return (
    <div className="w-full h-64 bg-gradient-to-b from-gray-50 to-gray-200 rounded-xl overflow-hidden border border-gray-200 relative">
      <Canvas shadows camera={{ position: [4, 4, 6], fov: 45 }}>
        <ambientLight intensity={0.7} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
        <Environment preset="city" />
        
        <TruckScene {...props} />
        
        <OrbitControls 
            enablePan={false} 
            minPolarAngle={0} 
            maxPolarAngle={Math.PI / 2.2}
            minDistance={4}
            maxDistance={15}
        />
      </Canvas>
      
      {/* 3D Label Badge */}
      <div className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-md text-[10px] font-bold text-[#1b4332] shadow-sm border border-white">
        Vista 3D Interactiva
      </div>
    </div>
  );
};

export default TruckVisualizer;