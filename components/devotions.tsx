"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Cross, Droplets, Heart } from "@/components/icons"

const devotions = [
  {
    title: "Blood Covenant Meditation",
    icon: Droplets,
    scripture: "2 Corinthians 5:21",
    verse:
      "For our sake he made him to be sin who knew no sin, so that in him we might become the righteousness of God.",
    reflection:
      "The blood of Jesus is not merely a symbol—it is the covenant seal of our righteousness. When Christ shed His blood, He didn't just cover our sins; He exchanged His righteousness for our sin. This is the great exchange: His perfection for our imperfection, His holiness for our brokenness. As you play the handpan, let each note remind you that you are not striving to become righteous—you already are righteous in Christ. The 432 Hz frequency resonates with this truth: you are in harmony with God through the blood covenant.",
    application:
      "Today, reject any thought that says you must earn God's favor. You are already favored, already righteous, already loved. Play your handpan as an act of worship, celebrating the finished work of the cross.",
  },
  {
    title: "Cross Victory Meditation",
    icon: Cross,
    scripture: "Colossians 2:14-15",
    verse:
      "He canceled the record of debt that stood against us with its legal demands. This he set aside, nailing it to the cross. He disarmed the rulers and authorities and put them to open shame, by triumphing over them in him.",
    reflection:
      "The cross is not a place of defeat—it is the throne of victory. Every accusation, every legal claim against you was nailed to the cross and canceled. The enemy has no authority over you because Jesus disarmed him publicly. When you worship, you are not begging God to move on your behalf; you are celebrating the victory that has already been won. The D Kurd scale, with its contemplative minor tonality, invites you into this mystery: the cross looked like defeat but was actually the greatest triumph in history.",
    application:
      "Identify one area where you feel defeated or accused. Declare over it: 'The cross has already won this battle.' Let your handpan playing be a declaration of victory, not a plea for help.",
  },
  {
    title: "Gospel Foundation",
    icon: Heart,
    scripture: "1 Corinthians 15:3-4",
    verse:
      "For I delivered to you as of first importance what I also received: that Christ died for our sins in accordance with the Scriptures, that he was buried, that he was raised on the third day in accordance with the Scriptures.",
    reflection:
      "The gospel is simple yet profound: Christ died, was buried, and rose again. This is the foundation of everything. Your righteousness is not based on your performance but on His resurrection. Because He lives, you live. Because He is righteous, you are righteous. The handpan's harmonic resonance at 432 Hz mirrors this truth—everything in creation is designed to resonate with the frequency of God's love and righteousness. When you play, you are participating in the cosmic song of redemption.",
    application:
      "Meditate on the resurrection today. Jesus didn't just die for you—He rose for you. You are not defined by your past but by His future. Play your handpan as a celebration of resurrection life.",
  },
]

export function Devotions() {
  return (
    <div className="space-y-6">
      <div className="fade-up">
        <h1 className="text-3xl font-bold">Righteousness Devotions</h1>
        <p className="text-muted-foreground">Meditations on the finished work of Christ</p>
      </div>

      <div className="grid gap-6">
        {devotions.map((devotion, index) => {
          const Icon = devotion.icon
          return (
            <Card
              key={devotion.title}
              className="glass-card fade-up"
              style={{ animationDelay: `${0.1 + index * 0.15}s` }}
            >
              <CardHeader>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-2xl">{devotion.title}</CardTitle>
                    <CardDescription className="mt-2">
                      <BookOpen className="w-4 h-4 inline mr-2" />
                      {devotion.scripture}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-lg bg-muted/50 border-l-4 border-primary">
                  <p className="italic text-foreground leading-relaxed">{devotion.verse}</p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Reflection</h4>
                  <p className="text-muted-foreground leading-relaxed">{devotion.reflection}</p>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Application</h4>
                  <p className="text-muted-foreground leading-relaxed">{devotion.application}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card className="glass-card bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30">
        <CardHeader>
          <CardTitle>About Righteousness Theology</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm leading-relaxed">
          <p>
            These devotions are rooted in the biblical truth that righteousness is a gift, not an achievement. Through
            the blood of Jesus and the victory of the cross, believers are made righteous—not by their works, but by
            faith in Christ's finished work.
          </p>
          <p>
            As you play the handpan and meditate on these truths, remember that worship is not about performing for God
            but celebrating what He has already done. The 432 Hz tuning is believed to resonate with the natural
            frequency of the universe, creating a sense of harmony and peace—a perfect metaphor for the harmony we have
            with God through Christ.
          </p>
          <p className="font-semibold">
            "For by grace you have been saved through faith. And this is not your own doing; it is the gift of God, not
            a result of works, so that no one may boast." - Ephesians 2:8-9
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
