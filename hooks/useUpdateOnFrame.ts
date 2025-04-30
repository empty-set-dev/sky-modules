export default function useUpdateOnFrame() {
    const [, setUpdate] = useState(false)

    useEffect(() => {
        requestAnimationFrame(update)

        function update(): void {
            requestAnimationFrame(update)
            setUpdate(update => !update)
        }
    }, [])
}
