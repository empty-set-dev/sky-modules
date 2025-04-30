export default function useUpdateOnAnimationFrame() {
    const [, setUpdate] = useState(false)

    useEffect(() => {
        requestAnimationFrame(update)

        function update(): void {
            requestAnimationFrame(update)
            setUpdate(update => !update)
        }
    }, [])
}
