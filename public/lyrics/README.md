# Synced Lyrics (LRC Files)

Place your `.lrc` files here for synced lyrics display.

## LRC Format
LRC files contain timestamped lyrics. Example:

```
[ti:Song Title]
[ar:Artist Name]
[00:00.00]First line of lyrics
[00:05.50]Second line of lyrics
[00:10.25]Third line of lyrics
```

## Naming Convention
- Name files to match the `lrcFile` field in `src/data/bhajans.json`
- Example: `om-jai-jagdish.lrc`, `hanuman-chalisa.lrc`

## Creating LRC Files

### Manual Creation
1. Create a `.lrc` file with the bhajan name
2. Add timestamps in `[mm:ss.xx]` format before each line
3. Play the audio and note timestamps for each line

### Using LRC Editors
- **Sylt Editor** (Windows)
- **LRC Maker** (Online)
- **MiniLyrics** (Windows)
- **lrcget** (Cross-platform)

### Example LRC File (hanuman-chalisa.lrc)
```
[ti:Hanuman Chalisa]
[ar:Tulsidas]
[00:00.00]
[00:05.00]श्री गुरु चरण सरोज रज
[00:10.00]निज मन मुकुर सुधार
[00:15.00]बरनऊं रघुबर बिमल जसु
[00:20.00]जो दायक फल चार
```

## Fallback
If no LRC file is found, the plain lyrics from `bhajans.json` will be displayed without sync.

## Tips
- Keep timestamps accurate for better sync experience
- Test with the audio to ensure proper alignment
- Use UTF-8 encoding for Hindi/Sanskrit text
