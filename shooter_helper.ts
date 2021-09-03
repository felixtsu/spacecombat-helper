//%block="空战Helpers"
//%weight=100 color=#E29E28 icon="\u2708"
namespace shooter_helper {

    let barWidth = NaN;
    let hpManagerSprites: Sprite[] = []
    const CUBICBIRD_HELPER_BLOCKS_SPRITE_HP_DATA_KEY = 'CUBICBIRD_HELPER_BLOCKS_SPRITE_HP_DATA_KEY'

    //%block
    //% blockId=cubicbirddisplayHitPointBar block="show %x percent of hp || on %sprite=variables_get(mySprite)"
    //% group="Display"
    export function displayHitPointBar(x: number, sprite: Sprite = null) {
        if (sprite != null) {
            displaySpriteHitPointBarImpl(sprite, x)
        } else {
            if (x <= 0) {
                barWidth = NaN;
            } else {
                barWidth = x / 5 * 6;
            }

            game.onShade(function () {
                if (barWidth) {
                    screen.fillRect(20, 110, 120, 4, 1)
                    screen.fillRect(20, 111, x / 5 * 6, 2, 3)
                }
            })
        }

    }

    function displaySpriteHitPointBarImpl(sprite: Sprite, x: number) {
        if (!hpManagerSprites.find(element => element === sprite)) {
            hpManagerSprites.push(sprite)
            sprite.onDestroyed(() => {
                hpManagerSprites.removeElement(sprite)
            })
        }
        sprite.data[CUBICBIRD_HELPER_BLOCKS_SPRITE_HP_DATA_KEY] = x
    }

    game.onShade(function () {
        let offsetX = game.currentScene().camera.offsetX
        let offsetY = game.currentScene().camera.offsetY

        for (let hpManagedSprite of hpManagerSprites) {
            let hpPercentage = hpManagedSprite.data[CUBICBIRD_HELPER_BLOCKS_SPRITE_HP_DATA_KEY]

            if (hpManagedSprite.isOutOfScreen(game.currentScene().camera)) {
                continue
            }

            if (hpPercentage > 0) {
                let height = hpManagedSprite.image.height
                let width = hpManagedSprite.image.width
                let barWidth = (width - 2) * hpPercentage / 100

                screen.fillRect(hpManagedSprite.x - width / 2 + 1 - offsetX, hpManagedSprite.y - height / 2 - 2 - offsetY, width - 2, 1, 1)
                screen.fillRect(hpManagedSprite.x - width / 2 + 1 - offsetX, hpManagedSprite.y - height / 2 - 2 - offsetY, barWidth, 1, 2)
            }
        }
    })

}
