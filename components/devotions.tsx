"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Cross, Droplets, Heart, Eye, Gift, ArrowUp, Share2 } from "@/components/icons"

const devotions = [
  {
    title: "Recognize: His Goodness & Our Need",
    icon: Eye,
    scripture: "Psalm 34:8 & Romans 3:23",
    verse:
      "Taste and see that the LORD is good; blessed is the one who takes refuge in him. For all have sinned and fall short of the glory of God.",
    reflection:
      "In order to love God with all our heart, mind, soul and strength, we must first recognize two vital truths: God is the ultimate source of all good, and we desperately need Him. Mark 10:18 reminds us that only God is good. We are not God, and we need Him to be God. This is not about shame—it's about humility. When we recognize His goodness and our need, we position ourselves to receive His love. The first step of worship is seeing Him clearly: as the compassionate one who is good to all (Psalm 145:9), whose mercy endures forever (Psalm 136:1).",
    application:
      "Before you play today, pause and acknowledge: 'God, You are good. I need You.' Let this simple prayer open your heart to worship from a place of honest humility rather than religious performance.",
  },
  {
    title: "Receive: His Love For You",
    icon: Gift,
    scripture: "1 John 4:10 & John 1:12",
    verse:
      "This is love: not that we loved God, but that he loved us and sent his Son as an atoning sacrifice for our sins. To all who did receive him, who believed in his name, he gave the right to become children of God.",
    reflection:
      "After recognizing God's goodness and our need, we must receive His love—saying 'yes' to His invitation to experience His mercy. This is not earning or achieving; it's accepting the gift of Jesus. 1 John 3:1 declares, 'See what great love the Father has lavished on us, that we should be called children of God!' Notice the word 'lavished'—this is extravagant, abundant, overwhelming love poured out freely. And here's the key from 1 John 4:19: 'We love because he first loved us.' Your ability to worship flows from first being loved.",
    application:
      "As you play each note at 432 Hz, let it remind you: 'I am deeply loved. I receive this love.' You cannot give what you have not received. Let His love saturate your soul before you offer worship back to Him.",
  },
  {
    title: "Respond: Love Him Back",
    icon: ArrowUp,
    scripture: "1 Samuel 12:24 & Psalm 18:1",
    verse:
      "Only fear the LORD and serve him faithfully with all your heart. For consider what great things he has done for you. I love you, LORD; you are my strength.",
    reflection:
      "Once we've recognized God's goodness, our need for Him, and received His love—now we respond with love back to Him. This is worship in its purest form: gratitude expressed through our whole being. 1 John 4:17-19 teaches that perfect love drives out fear, and we love because He first loved us. Your worship is not meant to impress God or earn His favor—you already have both. Your worship is simply saying 'I love You back, God!' with your voice, your hands on the handpan, your mind focused on His goodness. This is the response of a heart that has been completely convinced and captivated by His love.",
    application:
      "Today, don't just play music—tell Him you love Him. Let each D Kurd melody be your love song back to the One who first loved you. Worship is your response to His relentless affection.",
  },
  {
    title: "Release: Share His Love With Others",
    icon: Share2,
    scripture: "Matthew 28:19 & Romans 10:14-15",
    verse:
      "Go therefore and make disciples of all nations. How then will they call on him in whom they have not believed? And how are they to believe in him of whom they have never heard? And how are they to hear without someone preaching?",
    reflection:
      "The journey doesn't end with personal worship—it extends outward. After recognizing, receiving, and responding, we must release His love to others. 1 John 4:7-21 makes it clear: we MUST love others because love comes from God. This is the Great Commission lived out through worship. Your handpan playing, your testimony, your very life becomes a declaration of God's love to a world that desperately needs to hear it. Romans 10:15 asks, 'How can they believe in the one of whom they have not heard?' You are the answer to that question. Release what you've received.",
    application:
      "Who in your life needs to hear about God's love today? As you worship, ask God to show you one person to share His goodness with. Your worship equips you to be a carrier of His presence to others.",
  },
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
    <div className="relative min-h-screen space-y-6">
      <div className="spline-container absolute top-0 left-0 w-full h-full -z-10">
        <iframe
          src="https://my.spline.design/ventura2copy-QlljPuDvQWfMiAnUXFOrCrsY"
          frameBorder="0"
          width="100%"
          height="100%"
          id="aura-spline"
          title="3D Background"
        />
      </div>
      <div className="relative z-10 space-y-6">
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
          <CardTitle>The 4 R's Framework: A Journey of Loving God</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-relaxed">
          <p>
            These devotions follow the <strong>4 R's Framework</strong> taught in Worship Academy: <strong>Recognize → Receive → Respond → Release</strong>. This framework helps us understand that loving God with all our heart, mind, soul, and strength begins with being completely convinced and captivated by His love for us.
          </p>
          
          <div className="grid gap-3 pl-4 border-l-4 border-primary/30">
            <div>
              <strong>1. Recognize:</strong> See His goodness as the ultimate source of good, and acknowledge our need for Him to be God.
            </div>
            <div>
              <strong>2. Receive:</strong> Say "yes" to His invitation, accepting the gift of Jesus and experiencing His lavished love.
            </div>
            <div>
              <strong>3. Respond:</strong> Love Him back—not to earn favor, but to celebrate what He has already done.
            </div>
            <div>
              <strong>4. Release:</strong> Share His love with others through testimony, worship, and the Great Commission.
            </div>
          </div>

          <p>
            As you play the handpan tuned to 432 Hz, let each note remind you of this journey. Worship is not about performing for God but celebrating what He has already done. The sacred frequency creates harmony and peace—a perfect metaphor for the harmony we have with God through Christ's finished work.
          </p>
          
          <p className="font-semibold">
            "We love because he first loved us." - 1 John 4:19
          </p>
        </CardContent>
      </Card>
      </div>
    </div>
  )
}
