import React, { useEffect, useRef } from "react";

const Error404 = () => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        let animId;

        const particles = Array.from({ length: 60 }, () => ({
            x: Math.random() * canvas.offsetWidth,
            y: Math.random() * canvas.offsetHeight,
            r: Math.random() * 1.5 + 0.3,
            dx: (Math.random() - 0.5) * 0.3,
            dy: (Math.random() - 0.5) * 0.3,
            o: Math.random() * 0.5 + 0.1,
        }));

        const resize = () => {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
        };
        resize();
        window.addEventListener("resize", resize);

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach((p) => {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(99,102,241,${p.o})`;
                ctx.fill();
                p.x += p.dx;
                p.y += p.dy;
                if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
            });
            animId = requestAnimationFrame(draw);
        };
        draw();

        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener("resize", resize);
        };
    }, []);

    return (
        <div className="relative min-h-screen bg-[#080d18] flex items-center justify-center overflow-hidden">

            {/* Particle canvas */}
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full pointer-events-none"
            />

            {/* Glow blobs */}
            <div className="absolute -top-24 -left-24 w-[500px] h-[500px] rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
            <div className="absolute -bottom-16 -right-16 w-[350px] h-[350px] rounded-full bg-violet-500/10 blur-3xl pointer-events-none" />

            {/* Card */}
            <div className="relative z-10 w-[90%] max-w-md text-center px-12 py-14 rounded-3xl border border-indigo-500/20 bg-slate-950/70 backdrop-blur-xl shadow-[0_32px_80px_rgba(0,0,0,0.5)]">

                {/* Top accent bar */}
                <div className="absolute top-0 left-0 right-0 h-[3px] rounded-t-3xl bg-gradient-to-r from-indigo-500 via-violet-500 to-indigo-300" />

                {/* Badge */}
                <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/25 rounded-full px-4 py-1 mb-6">
                    <span className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_6px_#6366f1] animate-pulse" />
                    <span className="text-[11px] font-medium text-indigo-300 uppercase tracking-widest">
                        Error
                    </span>
                </div>

                {/* 404 number */}
                <div className="font-extrabold leading-none mb-2 text-[clamp(80px,16vw,120px)] bg-gradient-to-br from-slate-200 via-indigo-300 to-indigo-500 bg-clip-text text-transparent tracking-tighter">
                    404
                </div>

                {/* Title */}
                <h1 className="text-xl font-bold text-slate-100 mb-3 tracking-tight">
                    Page not found
                </h1>

                {/* Description */}
                <p className="text-sm text-slate-500 leading-relaxed mb-9 font-light">
                    The page you're looking for doesn't exist or
                    <br />
                    has been moved to another location.
                </p>

                {/* Actions */}
                <div className="flex items-center justify-center gap-3 flex-wrap">
                    <a
                        href="/"
                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 text-white text-sm font-medium shadow-[0_4px_20px_rgba(99,102,241,0.35)] hover:opacity-90 hover:-translate-y-px transition-all duration-150"
                    >
                        ← Go home
                    </a>
                    <button
                        onClick={() => window.history.back()}
                        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-white/5 border border-white/10 text-slate-400 text-sm font-normal hover:bg-white/10 hover:text-slate-200 hover:-translate-y-px transition-all duration-150"
                    >
                        Go back
                    </button>
                </div>

                {/* Footer hint */}
                <div className="mt-7 pt-5 border-t border-indigo-500/10">
                    <p className="text-xs text-slate-600">
                        If this keeps happening, please contact support.
                    </p>
                </div>

            </div>{/* ← closes Card */}

        </div > /* ← closes root */
    );
};

export default Error404;