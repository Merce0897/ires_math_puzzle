export async function fetchImage({ queryKey }) {
    const [_key, { width, height }] = queryKey;
    const response = await fetch(`https://picsum.photos/${Math.round(width)}/${Math.round(height)}`);
    console.log('fetch data', width, height);
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
}