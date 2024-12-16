export default function ballAnimate() {
    const morse_code = '.-..--';
    const ball = document.querySelector('.ball');
    if (!ball) return; // Guard clause in case the ball element is not found

    let duration = 0;

    // Helper function to handle the animation for dot and dash
    const animate = (type, time) => {
        const inClass = `${type}-in`;
        const outClass = `${type}-out`;

        setTimeout(() => {
            ball.classList.add(inClass);
            setTimeout(() => {
                ball.classList.remove(inClass);
                ball.classList.add(outClass);
                setTimeout(() => {
                    ball.classList.remove(outClass);
                }, time); // Wait 100ms before removing out animation
            }, 100); // Wait for the duration of the type ('dot' or 'dash')
        }, duration);

        duration += time + 100; // Add time for animation and the gap
    };

    for (const character of morse_code) {
        if (character === '.') {
            animate('dot', 100);
        } else if (character === '-') {
            animate('dash', 300);
        }
    }
}
