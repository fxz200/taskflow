import { Link } from '@heroui/react'

interface AnnouncementTextProps {
  text: string
  publishTime?: string
}

const AnnouncementText = ({ text, publishTime }: AnnouncementTextProps) => {
  return (
    <div className="w-full bg-white p-6 rounded-lg font-light text-sm">
      <p>{publishTime}</p>
      {text?.split('\n').map((line: string, idx: number) => {
        // 檢查是否有 URL
        const strings = line.split(/(https?:\/\/\S+)/g)
        return (
          <span key={idx}>
            {strings.map((str: string, i: number) => {
              if (str.match(/https?:\/\/\S+/)) {
                const urlSplit = str.split('/')
                const issueId = urlSplit[urlSplit.length - 1]
                return (
                  <Link
                    key={i}
                    href={str}
                    size="sm"
                    color="foreground"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline decoration-1 underline-offset-4"
                  >
                    {issueId}
                  </Link>
                )
              }
              return <span key={i}>{str}</span>
            })}
            {!line.trim().match(/^(https?:\/\/\S+)$/) && <br />}{' '}
          </span>
        )
      })}
    </div>
  )
}

export default AnnouncementText
